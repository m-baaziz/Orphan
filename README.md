# Notes

- text matching should be run against:
    - phenotypes (all phenotypes under selected zones, i.e phenotype_classification) 
    - phenotype_classifications to include any forgotten zone selection

# Models

## Phenotype

### embeddings

type: array
First element -> embedding of the name
other elements -> embeddings of the description, sentence-wise.

# TODOs:

- graphql client side
- replace console.logs with real logger
- init material-ui
- graphql connection model to support pagination
- in scripts: prepared queries / string escaping to be robust against invalid characters / mongo injection
