export type SearchQuery = {
  [type in 'and' | 'or' | 'not' | 'filter']?: (QueryExpression | SearchQuery)[];
};

export type QueryExpression = {
  [type in 'fullText' | 'exact' | 'prefix' | 'range' | 'wildcard' | 'exist']?: {
    field: string;
    language?: string;
    value?: string;
    caseInsensitive?: boolean;
    fieldType?: string;
    mustMatch?: string; //fullText only
    gt?: string; //range only
    lt?: string; //range only
    gte?: string; //range only
    lte?: string; //range only
  };
};
