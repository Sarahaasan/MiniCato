export type BaseUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
};

export type Lawyer = BaseUser & {
  role: "lawyer";

  // ================= LOCATION =================
  governorate1: string;
  city1: string;
  governorate2?: string;
  city2?: string;

  // ================= PROFESSIONAL =================
  specialization: string;
  experience: number;
  registrationNumber: string;

  // ================= DOCUMENTS =================
  // stored as filenames/paths once actually saved to disk or cloud storage
  idCard: string;
  unionCard: string;
  practiceCertificate: string;
};

export type Client = BaseUser & {
  role: "client";
};

export type User = Lawyer | Client;

export const Users: User[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@gmail.com",
    phone: "01012345678",
    password: "password123",
    role: "lawyer",
    governorate1: "Cairo",
    city1: "Nasr City",
    specialization: "civil",
    experience: 5,
    registrationNumber: "12345",
    idCard: "id-card-sample.jpg",
    unionCard: "union-card-sample.jpg",
    practiceCertificate: "practice-certificate-sample.pdf",
  },
];