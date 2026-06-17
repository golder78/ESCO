import api from "./api"

export const submitContact = async (contactData) => {
  const { data } = await api.post("/contact", contactData)
  return data
}

const contactService = { submitContact }
export default contactService
