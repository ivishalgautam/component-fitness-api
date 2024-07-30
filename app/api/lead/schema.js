export const schema = {
  post: {
    body: {
      type: "object",
      properties: {
        fullname: { type: "string", minLength: 3 },
        email: { type: "string", format: "email" },
        mobile_number: { type: "string", minLength: 3 },
        source: { type: "string", minLength: 3 },
        sales_person_id: { type: "string", format: "uuid" },
        location: { type: "string", minLength: 3 },
      },
      required: [
        "fullname",
        "email",
        "mobile_number",
        "source",
        "sales_person_id",
        "location",
      ],
    },
  },
  convertToCustomer: {
    body: {
      type: "object",
      properties: {
        username: { type: "string", minLength: 3 },
        password: { type: "string", minLength: 3 },
        avatar: { type: "string", minLength: 3 },
        membership_id: { type: "string", format: "uuid" },
        trainer_id: { type: "string", format: "uuid" },
        start_date: { type: "string", minLength: 1 },
        end_date: { type: "string", minLength: 1 },
        discount_in_percent: { type: "number", minimum: 0 },
      },
      required: [
        "username",
        "password",
        "avatar",
        "trainer_id",
        "membership_id",
        "start_date",
        "end_date",
        "discount_in_percent",
      ],
    },
  },
};