import { registerService } from "./src/services/auth.service.js";
import { faker } from "@faker-js/faker";
const generatePhoneNumber = () => {
  // let generate 10 numbers with prefix is 0
  let phoneNumber = "0";
  for (let i = 0; i < 9; i++) {
    phoneNumber += Math.floor(Math.random() * (9 - 0 + 1) + 0).toString();
  }
  return phoneNumber;
};

const generateData = async (size) => {
  await Promise.all(
    Array.from({ length: size }, async () => {
      const name = faker.person.fullName();
      const email = faker.internet.email();
      const phoneNumber = generatePhoneNumber();
      console.log(phoneNumber);
      const gender = faker.helpers.arrayElement(["Nam", "Nữ"]);
      const password = "Vip@1234";
      const confirmPassword = "Vip@1234";
      const { EC, EM, DT } = await registerService({
        name,
        email,
        phoneNumber,
        password,
        confirmPassword,
        gender,
      });
      console.log({ EC, EM, DT });
    })
  );
};
export default generateData;