use itertools::izip;
use reqwest;

use bson::{bson, doc, Bson, Document};
use linked_hash_map::LinkedHashMap;
use mongodb::{options::FindOptions, Client};
use scraper::{Html, Selector};
use simple_error::SimpleError;
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;
use strum::IntoEnumIterator;

mod models;
use models::orphan_center::{Center, CenterWithDisorders, CountryCode, Url};

static DB_URL: &str = "mongodb://localhost:27017/";
static DB_DATABASE: &str = "kibo";

fn main() -> Result<(), Box<std::error::Error>> {
  println!("Start scrapper");
  let db_client = Client::with_uri_str(DB_URL)?;
  let db = db_client.database(DB_DATABASE);
  let disorders_collection = db.collection("disorders_classification");
  let expert_centers_collection = db.collection("expert_centers");

  let cursor =
    disorders_collection.find(None, FindOptions::builder().no_cursor_timeout(true).build())?;

  for result in cursor {
    match result {
      Ok(document) => {
        if let Some(expert_link) = document.get("expertLink").and_then(Bson::as_str) {
          if let Some(_) = document.get("centers").and_then(Bson::as_array) {
            continue;
          }
          println!("processing expert link: {}", expert_link);
          match process_disorder(expert_link) {
            Ok(centers) => {
              if let Some(id) = document.get("_id").and_then(Bson::as_object_id) {
                if let Some(orpha_number) = document.get("orphaNumber").and_then(Bson::as_str) {
                  let serialized_centers = bson::to_bson(&centers)?;
                  let filter = doc! {"_id" => bson::oid::ObjectId::with_bytes(id.bytes())};
                  let update = doc! {"$set" => {"centers" => serialized_centers}};
                  disorders_collection
                    .update_one(filter, update, None)
                    .unwrap();
                  for center in centers.iter() {
                    let center_filter = doc! {"url" => center.url.to_string()};
                    let expert_center =
                      expert_centers_collection.find_one(center_filter.clone(), None)?;
                    match expert_center {
                      Some(center_document) => {
                        if let Some(center_disorders) =
                          center_document.get("disorders").and_then(Bson::as_array)
                        {
                          if !center_disorders.contains(&bson::to_bson(orpha_number)?) {
                            let center_update = doc! {"$push" => {"disorders" => orpha_number}};
                            expert_centers_collection
                              .update_one(center_filter.clone(), center_update, None)
                              .unwrap();
                          }
                        }
                      }
                      None => {
                        let center_with_disorder = CenterWithDisorders::new(
                          center.clone(),
                          vec![String::from(orpha_number)],
                        );
                        let center_with_disorder_bson = bson::to_bson(&center_with_disorder)?;
                        if let bson::Bson::Document(center_document) = center_with_disorder_bson {
                          expert_centers_collection
                            .insert_one(center_document, None)
                            .unwrap();
                        }
                      }
                    }
                  }
                  println!(
                    "Successfully processed link {} for disorder {}",
                    expert_link, id
                  );
                }
              }
            }
            Err(e) => return Err(e.into()),
          }
        } else {
          println!("no expert link found");
        }
      }
      Err(e) => return Err(e.into()),
    }
  }

  return Ok(());
}

fn process_disorder(url: &str) -> Result<Vec<Center>, Box<std::error::Error>> {
  let mut resp = reqwest::get(&url.to_string())?;
  if !resp.status().is_success() {
    return Err(Box::new(SimpleError::new(format!(
      "Invalid status coode: {:}",
      resp.status()
    ))));
  }
  println!("Status Code: {:}", resp.status());
  let html = resp.text().unwrap();
  save_html("scrapped", &html);

  let expert_link = extract_experts_link(&html);
  match expert_link {
    Some(href) => {
      println!("Expert link found : {}", href);
      let experts_list_url = Url {
        extension: String::from(href),
      };
      let mut centers: Vec<Center> = Vec::new();
      for code in CountryCode::iter() {
        match process_experts_link(&experts_list_url.to_string(), code) {
          Ok(fetched_centers) => {
            centers.extend(fetched_centers);
          }
          Err(e) => return Err(e.into()),
        }
      }
      return Ok(centers);
    }
    None => {
      println!("No expert link found !");
      return Ok(vec![]);
    }
  };
}

fn save_html(filename: &str, html: &str) {
  let path_str = format!("html/{}.html", filename);
  let path = Path::new(&path_str);
  let display = path.display();

  let mut file = match File::create(&path) {
    Err(why) => panic!("couldn't create {}: {}", display, why),
    Ok(file) => file,
  };

  match file.write_all(html.as_bytes()) {
    Err(why) => panic!("Couldn't save content to file {}: {}", display, why),
    Ok(_) => println!("Successfully saved content to {}", display),
  };
}

fn extract_experts_link(html: &str) -> Option<String> {
  let fragment = Html::parse_document(html);
  let links_selector = Selector::parse(".articleAdd > div > ul > li > a").unwrap();

  let link_ref = fragment
    .select(&links_selector)
    .find(|&a| match a.text().next() {
      Some(text) => text.contains("Expert centres"),
      None => false,
    });

  match link_ref?.value().attr("href") {
    Some(href) => Some(String::from(href)),
    None => None,
  }
}

fn process_experts_link(
  url: &str,
  country_code: CountryCode,
) -> Result<Vec<Center>, Box<std::error::Error>> {
  let url_with_country = format!(
    "{:}&Clinics_Clinics_Search_country={:}",
    url,
    country_code.to_string()
  );
  println!("Processing link {}", url_with_country);
  let mut resp = reqwest::get(&url_with_country)?;
  if !resp.status().is_success() {
    return Err(Box::new(SimpleError::new(format!(
      "Invalid status coode: {:}",
      resp.status()
    ))));
  }
  println!("Status Code: {:}", resp.status());
  let html = resp.text().unwrap();

  save_html("experts_list", &html);

  let centers = extract_expert_centers(&html, country_code);
  println!("extracted centers: {:#?}", centers);

  return Ok(centers);
}

fn extract_expert_centers(html: &str, country_code: CountryCode) -> Vec<Center> {
  let fragment = Html::parse_document(html);
  let name_selector = Selector::parse(".oneResult > div:nth-child(2) > h4 > a").unwrap();
  let location_selector = Selector::parse(".oneResult > div:nth-child(2) > h4 > div").unwrap();

  let extract_text = |selector: &Selector| {
    return fragment
      .select(selector)
      .map(|a| match a.text().next() {
        Some(text) => text,
        None => "",
      })
      .collect::<Vec<&str>>();
  };
  let name_refs = extract_text(&name_selector);
  let location_refs = extract_text(&location_selector);
  let href_refs = fragment
    .select(&name_selector)
    .filter_map(|h| h.value().attr("href"));

  let result = izip!(name_refs, location_refs, href_refs)
    .map(|(name_str, location_str, href_str)| Center {
      name: String::from(name_str),
      location: String::from(location_str),
      url: Url {
        extension: String::from(href_str),
      },
      country: country_code.clone(),
    })
    .collect::<Vec<Center>>();

  return result;
}
