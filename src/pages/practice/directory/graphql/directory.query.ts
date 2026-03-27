import { gql } from "@apollo/client";

// --- 1. MAIN FETCH QUERY ---
export const GET_PRACTICE_DIRECTORY_QUERY = gql`
  query GetPracticeDirectory($id: uuid!) {
    practice_info_by_pk(id: $id) {
      # Core Info (Single Source of Truth)
      id
      practice_name 
      logo          
      abn_number
      practice_type
      practice_phone
      address
      city
      state
      postcode
      first_name
      last_name
      email
      mobile
      type
      status

      # Base Info (Child - Removed Redundant Fields)
      practice_base_info {
        id
        website
        directions
        alert_message
        facebook_url
        instagram_url
        twitter_url
        youtube_url
        formatted_address
        banner_image
        description
      }

      # Arrays (1:N Relationships)
      practice_opening_hours {
        id
        day_of_week
        is_open
        time_slots
      }
      practice_facilities {
        id
        facility_name
      }
      practice_team_members {
        id
        name
        role
        qualification
        gender
        ahpra_number
        education
        languages
        professional_statement
        areas_of_interest
        image
        is_visible_online
        allow_multiple_bookings
        booking_time_limit
        booking_time_limit_unit
        cancel_time_limit
        cancel_time_limit_unit
        appointment_types
      }
      practice_services {
        id
        name
        description
        show_in_appointment
      }
      practice_insurances {
        id
        provider_name
      }
      practice_galleries {
        id
        image_url
        caption
      }
      practice_achievements {
        id
        title
        image_url
      }
      practice_certifications {
        id
        title
        image_url
      }
      practice_exceptions {
        id
        exception_date
        is_closed
        start_time
        end_time
        label
        note
      }
    }
  }
`;

// --- 2. BASE INFO MUTATION ---

export const UPDATE_PRACTICE_DIRECTORY_MUTATION = gql`
  mutation UpdatePracticeDirectory(
    $id: uuid!, 
    $infoChanges: practice_info_set_input!,
    $baseInfoChanges: practice_base_info_insert_input!
  ) {
    # 1. Update Parent Table (Source of Truth for Name/Logo)
    update_practice_info_by_pk(pk_columns: { id: $id }, _set: $infoChanges) {
      id
    }

    # 2. Upsert Child Table (Base Info)
    insert_practice_base_info_one(
      object: $baseInfoChanges,
      on_conflict: {
        constraint: practice_base_info_practice_id_key,
        update_columns: [
          # REMOVED: practice_name
          # REMOVED: logo
          website, 
          directions, 
          alert_message, 
          facebook_url, 
          instagram_url, 
          twitter_url, 
          youtube_url, 
          formatted_address, 
          banner_image, 
          description
        ]
      }
    ) {
      id
    }
  }
`;

// --- 3. BULK REPLACE ARRAY MUTATIONS (Unchanged) ---

export const UPDATE_PRACTICE_SERVICES_MUTATION = gql`
  mutation UpdatePracticeServices($practiceId: uuid!, $services: [practice_services_insert_input!]!) {
    delete_practice_services(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_services(objects: $services) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_CERTIFICATIONS_MUTATION = gql`
  mutation UpdatePracticeCertifications($practiceId: uuid!, $certifications: [practice_certifications_insert_input!]!) {
    delete_practice_certifications(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_certifications(objects: $certifications) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_ACHIEVEMENTS_MUTATION = gql`
  mutation UpdatePracticeAchievements($practiceId: uuid!, $achievements: [practice_achievements_insert_input!]!) {
    delete_practice_achievements(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_achievements(objects: $achievements) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_TEAM_MUTATION = gql`
  mutation UpdatePracticeTeam($objects: [practice_team_members_insert_input!]!) {
    insert_practice_team_members(
      objects: $objects,
      on_conflict: {
        constraint: practice_team_members_pkey,
        update_columns: [
          name, role, qualification, gender, ahpra_number, education, 
          languages, professional_statement, areas_of_interest, image, 
          is_visible_online, allow_multiple_bookings, booking_time_limit, 
          booking_time_limit_unit, cancel_time_limit, cancel_time_limit_unit, 
          appointment_types
        ]
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_PRACTICE_TEAM_MEMBER_MUTATION = gql`
  mutation DeletePracticeTeamMember($id: uuid!) {
    delete_practice_team_members_by_pk(id: $id) {
      id
    }
  }
`;

export const UPDATE_PRACTICE_GALLERY_MUTATION = gql`
  mutation UpdatePracticeGallery($practiceId: uuid!, $galleries: [practice_gallery_insert_input!]!) {
    delete_practice_gallery(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_gallery(objects: $galleries) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_INSURANCES_MUTATION = gql`
  mutation UpdatePracticeInsurances($practiceId: uuid!, $insurances: [practice_insurances_insert_input!]!) {
    delete_practice_insurances(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_insurances(objects: $insurances) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_FACILITIES_MUTATION = gql`
  mutation UpdatePracticeFacilities($practiceId: uuid!, $facilities: [practice_facilities_insert_input!]!) {
    delete_practice_facilities(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_facilities(objects: $facilities) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_OPENING_HOURS_MUTATION = gql`
  mutation UpdatePracticeOpeningHours($practiceId: uuid!, $hours: [practice_opening_hours_insert_input!]!) {
    delete_practice_opening_hours(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_opening_hours(objects: $hours) { affected_rows }
  }
`;

export const UPDATE_PRACTICE_EXCEPTIONS_MUTATION = gql`
  mutation UpdatePracticeExceptions($practiceId: uuid!, $exceptions: [practice_exceptions_insert_input!]!) {
    delete_practice_exceptions(where: { practice_id: { _eq: $practiceId } }) { affected_rows }
    insert_practice_exceptions(objects: $exceptions) { affected_rows }
  }
`;