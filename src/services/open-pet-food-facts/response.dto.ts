export interface Root {
  code: string
  product: Product
  status: number
  status_verbose: string
}

export interface Product {
  _id: string
  _keywords: string[]
  added_countries_tags: any[]
  additives_n: number
  additives_original_tags: string[]
  additives_tags: string[]
  allergens: string
  allergens_from_ingredients: string
  allergens_from_user: string
  allergens_hierarchy: string[]
  allergens_lc: string
  allergens_tags: string[]
  amino_acids_prev_tags: any[]
  amino_acids_tags: any[]
  brands: string
  brands_old: string
  brands_tags: string[]
  categories: string
  categories_hierarchy: string[]
  categories_lc: string
  categories_properties: CategoriesProperties
  categories_properties_tags: string[]
  categories_tags: string[]
  checkers_tags: any[]
  cities_tags: any[]
  code: string
  codes_tags: string[]
  compared_to_category: string
  complete: number
  completeness: number
  correctors_tags: string[]
  countries: string
  countries_hierarchy: string[]
  countries_lc: string
  countries_tags: string[]
  created_t: number
  creator: string
  data_quality_bugs_tags: any[]
  data_quality_completeness_tags: any[]
  data_quality_errors_tags: any[]
  data_quality_info_tags: string[]
  data_quality_tags: string[]
  data_quality_warnings_tags: any[]
  data_sources: string
  data_sources_tags: string[]
  debug_param_sorted_langs: string[]
  ecoscore_data: EcoscoreData
  ecoscore_grade: string
  ecoscore_tags: string[]
  editors_tags: string[]
  emb_codes: string
  emb_codes_orig: string
  emb_codes_tags: any[]
  entry_dates_tags: string[]
  expiration_date: string
  food_groups_tags: any[]
  "fruits-vegetables-nuts_100g_estimate": number
  generic_name: string
  generic_name_fr: string
  generic_name_it: string
  id: string
  image_front_small_url: string
  image_front_thumb_url: string
  image_front_url: string
  image_ingredients_small_url: string
  image_ingredients_thumb_url: string
  image_ingredients_url: string
  image_nutrition_small_url: string
  image_nutrition_thumb_url: string
  image_nutrition_url: string
  image_small_url: string
  image_thumb_url: string
  image_url: string
  images: Images
  informers_tags: string[]
  ingredients: Ingredient[]
  ingredients_analysis: IngredientsAnalysis
  ingredients_analysis_tags: string[]
  ingredients_debug: any[]
  ingredients_from_palm_oil_tags: any[]
  ingredients_hierarchy: string[]
  ingredients_ids_debug: any[]
  ingredients_lc: string
  ingredients_n: number
  ingredients_n_tags: string[]
  ingredients_non_nutritive_sweeteners_n: number
  ingredients_original_tags: string[]
  ingredients_percent_analysis: number
  ingredients_sweeteners_n: number
  ingredients_tags: string[]
  ingredients_text: string
  ingredients_text_debug: string
  ingredients_text_fr: string
  ingredients_text_it: string
  ingredients_text_with_allergens: string
  ingredients_text_with_allergens_fr: string
  ingredients_text_with_allergens_it: string
  ingredients_that_may_be_from_palm_oil_tags: any[]
  ingredients_with_specified_percent_n: number
  ingredients_with_specified_percent_sum: number
  ingredients_with_unspecified_percent_n: number
  ingredients_with_unspecified_percent_sum: number
  ingredients_without_ciqual_codes: string[]
  ingredients_without_ciqual_codes_n: number
  ingredients_without_ecobalyse_ids: string[]
  ingredients_without_ecobalyse_ids_n: number
  interface_version_created: string
  interface_version_modified: string
  known_ingredients_n: number
  labels: string
  labels_hierarchy: any[]
  labels_lc: string
  labels_tags: any[]
  lang: string
  languages: Languages
  languages_codes: LanguagesCodes
  languages_hierarchy: string[]
  languages_tags: string[]
  last_edit_dates_tags: string[]
  last_editor: string
  last_image_dates_tags: string[]
  last_image_t: number
  last_modified_by: string
  last_modified_t: number
  last_updated_t: number
  lc: string
  link: string
  main_countries_tags: any[]
  manufacturing_places: string
  manufacturing_places_tags: any[]
  max_imgid: string
  minerals_prev_tags: any[]
  minerals_tags: any[]
  misc_tags: string[]
  no_nutrition_data: string
  nova_group: number
  nova_group_debug: string
  nova_groups: string
  nova_groups_markers: NovaGroupsMarkers
  nova_groups_tags: string[]
  nucleotides_prev_tags: any[]
  nucleotides_tags: any[]
  nutrient_levels: NutrientLevels
  nutrient_levels_tags: string[]
  nutriments: Nutriments
  nutriscore: Nutriscore
  nutriscore_2021_tags: string[]
  nutriscore_2023_tags: string[]
  nutriscore_grade: string
  nutriscore_tags: string[]
  nutriscore_version: string
  nutrition_data: string
  nutrition_data_per: string
  nutrition_data_prepared_per: string
  nutrition_grade_fr: string
  nutrition_grades: string
  nutrition_grades_tags: string[]
  nutrition_score_beverage: number
  nutrition_score_debug: string
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients: number
  nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value: number
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number
  nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number
  origin: string
  origin_fr: string
  origin_it: string
  origins: string
  origins_hierarchy: any[]
  origins_lc: string
  origins_tags: any[]
  other_nutritional_substances_prev_tags: any[]
  other_nutritional_substances_tags: any[]
  packaging: string
  packaging_debug_tags: any[]
  packaging_materials_tags: any[]
  packaging_recycling_tags: any[]
  packaging_shapes_tags: any[]
  packaging_tags: any[]
  packaging_text: string
  packaging_text_fr: string
  packaging_text_it: string
  packagings: any[]
  packagings_complete: number
  packagings_materials: PackagingsMaterials
  photographers_tags: string[]
  pnns_groups_1: string
  pnns_groups_1_tags: string[]
  pnns_groups_2: string
  pnns_groups_2_tags: string[]
  popularity_key: number
  popularity_tags: string[]
  product_name: string
  product_name_fr: string
  product_name_it: string
  product_quantity: number
  product_quantity_unit: string
  product_type: string
  purchase_places: string
  purchase_places_tags: any[]
  quantity: string
  removed_countries_tags: any[]
  rev: number
  scans_n: number
  schema_version: number
  selected_images: SelectedImages
  serving_size_debug_tags: any[]
  sortkey: number
  states: string
  states_hierarchy: string[]
  states_tags: string[]
  stores: string
  stores_tags: any[]
  teams: string
  teams_tags: string[]
  traces: string
  traces_from_ingredients: string
  traces_from_user: string
  traces_hierarchy: any[]
  traces_lc: string
  traces_tags: any[]
  unique_scans_n: number
  unknown_ingredients_n: number
  unknown_nutrients_tags: any[]
  update_key: string
  vitamins_prev_tags: any[]
  vitamins_tags: any[]
  weighers_tags: any[]
}

export interface CategoriesProperties {}

export interface EcoscoreData {
  adjustments: Adjustments
  agribalyse: Agribalyse
  grade: string
  missing: Missing
  missing_agribalyse_match_warning: number
  missing_key_data: number
  status: string
}

export interface Adjustments {
  origins_of_ingredients: OriginsOfIngredients
  packaging: Packaging
  production_system: ProductionSystem
  threatened_species: ThreatenedSpecies
}

export interface OriginsOfIngredients {
  aggregated_origins: AggregatedOrigin[]
  epi_score: number
  epi_value: number
  origins_from_categories: string[]
  origins_from_origins_field: string[]
  transportation_scores: TransportationScores
  transportation_values: TransportationValues
  values: Values
  warning: string
}

export interface AggregatedOrigin {
  origin: string
  percent: number
}

export interface TransportationScores {
  ad: number
  al: number
  at: number
  ax: number
  ba: number
  be: number
  bg: number
  ch: number
  cy: number
  cz: number
  de: number
  dk: number
  dz: number
  ee: number
  eg: number
  es: number
  fi: number
  fo: number
  fr: number
  gg: number
  gi: number
  gr: number
  hr: number
  hu: number
  ie: number
  il: number
  im: number
  is: number
  it: number
  je: number
  lb: number
  li: number
  lt: number
  lu: number
  lv: number
  ly: number
  ma: number
  mc: number
  md: number
  me: number
  mk: number
  mt: number
  nl: number
  no: number
  pl: number
  ps: number
  pt: number
  ro: number
  rs: number
  se: number
  si: number
  sj: number
  sk: number
  sm: number
  sy: number
  tn: number
  tr: number
  ua: number
  uk: number
  us: number
  va: number
  world: number
  xk: number
}

export interface TransportationValues {
  ad: number
  al: number
  at: number
  ax: number
  ba: number
  be: number
  bg: number
  ch: number
  cy: number
  cz: number
  de: number
  dk: number
  dz: number
  ee: number
  eg: number
  es: number
  fi: number
  fo: number
  fr: number
  gg: number
  gi: number
  gr: number
  hr: number
  hu: number
  ie: number
  il: number
  im: number
  is: number
  it: number
  je: number
  lb: number
  li: number
  lt: number
  lu: number
  lv: number
  ly: number
  ma: number
  mc: number
  md: number
  me: number
  mk: number
  mt: number
  nl: number
  no: number
  pl: number
  ps: number
  pt: number
  ro: number
  rs: number
  se: number
  si: number
  sj: number
  sk: number
  sm: number
  sy: number
  tn: number
  tr: number
  ua: number
  uk: number
  us: number
  va: number
  world: number
  xk: number
}

export interface Values {
  ad: number
  al: number
  at: number
  ax: number
  ba: number
  be: number
  bg: number
  ch: number
  cy: number
  cz: number
  de: number
  dk: number
  dz: number
  ee: number
  eg: number
  es: number
  fi: number
  fo: number
  fr: number
  gg: number
  gi: number
  gr: number
  hr: number
  hu: number
  ie: number
  il: number
  im: number
  is: number
  it: number
  je: number
  lb: number
  li: number
  lt: number
  lu: number
  lv: number
  ly: number
  ma: number
  mc: number
  md: number
  me: number
  mk: number
  mt: number
  nl: number
  no: number
  pl: number
  ps: number
  pt: number
  ro: number
  rs: number
  se: number
  si: number
  sj: number
  sk: number
  sm: number
  sy: number
  tn: number
  tr: number
  ua: number
  uk: number
  us: number
  va: number
  world: number
  xk: number
}

export interface Packaging {
  value: number
  warning: string
}

export interface ProductionSystem {
  labels: any[]
  value: number
  warning: string
}

export interface ThreatenedSpecies {}

export interface Agribalyse {
  warning: string
}

export interface Missing {
  agb_category: number
  labels: number
  origins: number
  packagings: number
}

export interface Images {
  "1": N1
  "2": N2
  "3": N3
  "4": N4
  "5": N5
  "6": N6
  "7": N7
  "8": N8
  front_fr: FrontFr
  front_it: FrontIt
  ingredients_fr: IngredientsFr
  nutrition_fr: NutritionFr
}

export interface N1 {
  sizes: Sizes
  uploaded_t: string
  uploader: string
}

export interface Sizes {
  "100": N100
  "400": N400
  full: Full
}

export interface N100 {
  h: number
  w: number
}

export interface N400 {
  h: number
  w: number
}

export interface Full {
  h: number
  w: number
}

export interface N2 {
  sizes: Sizes2
  uploaded_t: number
  uploader: string
}

export interface Sizes2 {
  "100": N1002
  "400": N4002
  full: Full2
}

export interface N1002 {
  h: number
  w: number
}

export interface N4002 {
  h: number
  w: number
}

export interface Full2 {
  h: number
  w: number
}

export interface N3 {
  sizes: Sizes3
  uploaded_t: number
  uploader: string
}

export interface Sizes3 {
  "100": N1003
  "400": N4003
  full: Full3
}

export interface N1003 {
  h: number
  w: number
}

export interface N4003 {
  h: number
  w: number
}

export interface Full3 {
  h: number
  w: number
}

export interface N4 {
  sizes: Sizes4
  uploaded_t: string
  uploader: string
}

export interface Sizes4 {
  "100": N1004
  "400": N4004
  full: Full4
}

export interface N1004 {
  h: number
  w: number
}

export interface N4004 {
  h: number
  w: number
}

export interface Full4 {
  h: number
  w: number
}

export interface N5 {
  sizes: Sizes5
  uploaded_t: number
  uploader: string
}

export interface Sizes5 {
  "100": N1005
  "400": N4005
  full: Full5
}

export interface N1005 {
  h: number
  w: number
}

export interface N4005 {
  h: number
  w: number
}

export interface Full5 {
  h: number
  w: number
}

export interface N6 {
  sizes: Sizes6
  uploaded_t: string
  uploader: string
}

export interface Sizes6 {
  "100": N1006
  "400": N4006
  full: Full6
}

export interface N1006 {
  h: number
  w: number
}

export interface N4006 {
  h: number
  w: number
}

export interface Full6 {
  h: number
  w: number
}

export interface N7 {
  sizes: Sizes7
  uploaded_t: number
  uploader: string
}

export interface Sizes7 {
  "100": N1007
  "400": N4007
  full: Full7
}

export interface N1007 {
  h: number
  w: number
}

export interface N4007 {
  h: number
  w: number
}

export interface Full7 {
  h: number
  w: number
}

export interface N8 {
  sizes: Sizes8
  uploaded_t: number
  uploader: string
}

export interface Sizes8 {
  "100": N1008
  "400": N4008
  full: Full8
}

export interface N1008 {
  h: number
  w: number
}

export interface N4008 {
  h: number
  w: number
}

export interface Full8 {
  h: number
  w: number
}

export interface FrontFr {
  imgid: string
  rev: string
  sizes: Sizes9
}

export interface Sizes9 {
  "100": N1009
  "200": N200
  "400": N4009
  full: Full9
}

export interface N1009 {
  h: number
  w: number
}

export interface N200 {
  h: number
  w: number
}

export interface N4009 {
  h: number
  w: number
}

export interface Full9 {
  h: number
  w: number
}

export interface FrontIt {
  imgid: string
  rev: string
  sizes: Sizes10
}

export interface Sizes10 {
  "100": N10010
  "200": N2002
  "400": N40010
  full: Full10
}

export interface N10010 {
  h: number
  w: number
}

export interface N2002 {
  h: number
  w: number
}

export interface N40010 {
  h: number
  w: number
}

export interface Full10 {
  h: number
  w: number
}

export interface IngredientsFr {
  imgid: string
  rev: string
  sizes: Sizes11
}

export interface Sizes11 {
  "100": N10011
  "200": N2003
  "400": N40011
  full: Full11
}

export interface N10011 {
  h: number
  w: number
}

export interface N2003 {
  h: number
  w: number
}

export interface N40011 {
  h: number
  w: number
}

export interface Full11 {
  h: number
  w: number
}

export interface NutritionFr {
  imgid: string
  rev: string
  sizes: Sizes12
}

export interface Sizes12 {
  "100": N10012
  "200": N2004
  "400": N40012
  full: Full12
}

export interface N10012 {
  h: number
  w: number
}

export interface N2004 {
  h: number
  w: number
}

export interface N40012 {
  h: number
  w: number
}

export interface Full12 {
  h: number
  w: number
}

export interface Ingredient {
  id: string
  is_in_taxonomy: number
  percent_estimate: number
  percent_max: number
  percent_min: number
  text: string
  ingredients?: Ingredient2[]
}

export interface Ingredient2 {
  id: string
  is_in_taxonomy: number
  percent_estimate: number
  percent_max: number
  percent_min: number
  text: string
  percent?: number
}

export interface IngredientsAnalysis {
  "en:palm-oil-content-unknown": string[]
  "en:vegan-status-unknown": string[]
  "en:vegetarian-status-unknown": string[]
}

export interface Languages {
  "en:french": number
  "en:italian": number
}

export interface LanguagesCodes {
  fr: number
  it: number
}

export interface NovaGroupsMarkers {
  "4": string[][]
}

export interface NutrientLevels {
  salt: string
  "saturated-fat": string
  sugars: string
}

export interface Nutriments {
  energy: number
  "energy-kcal": number
  "energy-kcal_100g": number
  "energy-kcal_unit": string
  "energy-kcal_value": number
  energy_100g: number
  energy_unit: string
  energy_value: number
  fiber: number
  fiber_100g: number
  fiber_unit: string
  fiber_value: number
  "fruits-vegetables-legumes-estimate-from-ingredients_100g": number
  "fruits-vegetables-legumes-estimate-from-ingredients_serving": number
  "fruits-vegetables-nuts-estimate-from-ingredients_100g": number
  "fruits-vegetables-nuts-estimate-from-ingredients_serving": number
  "nova-group": number
  "nova-group_100g": number
  "nova-group_serving": number
  proteins: number
  proteins_100g: number
  proteins_unit: string
  proteins_value: number
  "saturated-fat": number
  "saturated-fat_100g": number
  "saturated-fat_unit": string
  "saturated-fat_value": number
  sodium: number
  sodium_100g: number
  sodium_unit: string
  sodium_value: number
  sugars: number
  sugars_100g: number
  sugars_unit: string
  sugars_value: number
}

export interface Nutriscore {
  "2021": N2021
  "2023": N2023
}

export interface N2021 {
  category_available: number
  data: Data
  grade: string
  nutrients_available: number
  nutriscore_applicable: number
  nutriscore_computed: number
}

export interface Data {
  energy: number
  fiber: number
  fruits_vegetables_nuts_colza_walnut_olive_oils: number
  is_beverage: number
  is_cheese: number
  is_fat: number
  is_water: number
  proteins: number
  saturated_fat: number
  sodium: number
  sugars: number
}

export interface N2023 {
  category_available: number
  data: Data2
  grade: string
  nutrients_available: number
  nutriscore_applicable: number
  nutriscore_computed: number
}

export interface Data2 {
  energy: number
  fiber: number
  fruits_vegetables_legumes: number
  is_beverage: number
  is_cheese: number
  is_fat_oil_nuts_seeds: number
  is_red_meat_product: number
  is_water: number
  proteins: number
  salt: number
  saturated_fat: number
  sugars: number
}

export interface PackagingsMaterials {}

export interface SelectedImages {
  front: Front
  ingredients: Ingredients
  nutrition: Nutrition
}

export interface Front {
  display: Display
  small: Small
  thumb: Thumb
}

export interface Display {
  fr: string
  it: string
}

export interface Small {
  fr: string
  it: string
}

export interface Thumb {
  fr: string
  it: string
}

export interface Ingredients {
  display: Display2
  small: Small2
  thumb: Thumb2
}

export interface Display2 {
  fr: string
}

export interface Small2 {
  fr: string
}

export interface Thumb2 {
  fr: string
}

export interface Nutrition {
  display: Display3
  small: Small3
  thumb: Thumb3
}

export interface Display3 {
  fr: string
}

export interface Small3 {
  fr: string
}

export interface Thumb3 {
  fr: string
}
