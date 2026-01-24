import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'

export function createServerApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
      fetch,
    }),
    cache: new InMemoryCache(),
    ssrMode: true,
  })
}


export function createBrowserApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/graphql/v1`,
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      },
    }),
    cache: new InMemoryCache(),
  })
}


export const apolloClient = createServerApolloClient()