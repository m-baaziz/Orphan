use bson::{bson, doc, Bson};
use mongodb::{options::FindOptions, Client};
use serde::{Deserialize, Serialize, Serializer};
use std::fmt;
use strum::IntoEnumIterator;
use strum_macros::{Display, EnumIter};

static BASE_URL: &str = "http://www.orpha.net/consor/cgi-bin";

#[derive(Deserialize, Debug, Clone)]
pub struct Url {
  pub extension: String,
}

#[derive(Deserialize, Serialize, Debug, EnumIter, Display, Clone)]
pub enum CountryCode {
  AM, // Armenia
  AT, // Austria
  BE, // Belgium
  BG, // Bulgaria
  CA, // Canada
  CH, // Switzerland
  CY, // Cyprus
  CZ, // Czech republic
  DE, // Germany
  DK, // Denmark
  EE, // Estonia
  ES, // Spain
  FI, // Finland
  FR, // France
  GB, // United kingdom
  GR, // Greece
  HR, // Croatia
  HU, // Hungary
  IE, // Ireland
  IL, // Israel
  IT, // Italy
  JP, // Japan
  LB, // Lebanon
  LT, // Lithuania
  LV, // Latvia
  MA, // Morocco
  NL, // Netherlands
  NO, // Norway
  PL, // Poland
  PT, // Portugal
  RO, // Romania
  RS, // Serbia
  SE, // Sweden
  SI, // Slovenia
  SK, // Slovakia
  TR, // Turkey
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct Center {
  pub name: String,
  pub location: String,
  pub url: Url,
  pub country: CountryCode,
}

#[derive(Deserialize, Serialize, Debug, Clone)]
pub struct CenterWithDisorders {
  pub name: String,
  pub location: String,
  pub url: Url,
  pub country: CountryCode,
  pub disorders: Vec<String>,
}

impl fmt::Display for Url {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}/{}", BASE_URL, self.extension)
  }
}

impl Serialize for Url {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: Serializer,
  {
    return serializer.serialize_str(&format!("{}", self));
  }
}

impl CenterWithDisorders {
  pub fn new(center: Center, disorders: Vec<String>) -> Self {
    CenterWithDisorders {
      name: center.name,
      location: center.location,
      url: center.url,
      country: center.country,
      disorders: disorders,
    }
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn test_convert_bson() {
    let centers = vec![
      Center {
        name: String::from("name1"),
        location: String::from("location1"),
        url: Url {
          extension: String::from("test"),
        },
        country: CountryCode::FR,
      },
      Center {
        name: String::from("name2"),
        location: String::from("location2"),
        url: Url {
          extension: String::from("test"),
        },
        country: CountryCode::FR,
      },
    ];

    for code in CountryCode::iter() {
      println!("CODE ::: {:?}", code);
    }
    let serialized_centers = bson::to_bson(&centers);
    println!("BSON VALUE :: {:?}", serialized_centers);
    assert_eq!(3, 3);
  }

  #[test]
  fn test_update_disorder_classification() {
    let db_client = Client::with_uri_str("mongodb://localhost:27017/").unwrap();
    let db = db_client.database("kibo");
    let disorders_collection = db.collection("disorders_classification");

    let centers = vec![
      Center {
        name: String::from("name1"),
        location: String::from("location1"),
        url: Url {
          extension: String::from("test"),
        },
        country: CountryCode::FR,
      },
      Center {
        name: String::from("name2"),
        location: String::from("location2"),
        url: Url {
          extension: String::from("test"),
        },
        country: CountryCode::FR,
      },
    ];

    let id = bson::oid::ObjectId::with_string("5d98909f94f61f24d7c97c00").unwrap();

    let serialized_centers = bson::to_bson(&centers).unwrap();
    let filter = doc! {"_id" => id};
    let update = doc! {"$set" => {"centers" => serialized_centers}};

    disorders_collection
      .update_one(filter, update, None)
      .unwrap();
    assert_eq!(2, 2);
  }
}
