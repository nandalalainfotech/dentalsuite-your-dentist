import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation loginApi($details: LoginInput!) {
    login_api(details: $details) {
      id
      accessToken
      refreshToken
      name
      email
      phone
      logo
      status
      message
      profile_completed
      payment_completed
      profile_image
      type
      address
      directory_category_id
      profession_type
      second_hand
      business_name
      abn_number
      gender
      sell_products
      dashboard_permissions
      plan_id
      payment_status
      subscription_id
      subscription_permissions
      sub_type
      owner_id
    }
  }
`;
