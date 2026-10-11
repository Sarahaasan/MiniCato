import { Users, User } from "../db";
import { userSchema } from "../../schemas/userSchema";

export async function GET() {
  return Response.json(Users);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  const body = {
    role: formData.get("role"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),

    // lawyer-only fields — harmless if missing for a client submission
    governorate1: formData.get("governorate1") || undefined,
    city1: formData.get("city1") || undefined,
    governorate2: formData.get("governorate2") || undefined,
    city2: formData.get("city2") || undefined,
    specialization: formData.get("specialization") || undefined,
    experience: formData.get("experience") || undefined,
    registrationNumber: formData.get("registrationNumber") || undefined,
    idCard: formData.get("idCard") || undefined,
    unionCard: formData.get("unionCard") || undefined,
    practiceCertificate: formData.get("practiceCertificate") || undefined,
  };

  const result = userSchema.safeParse(body);

  if (!result.success) {
    return Response.json(
      {
        success: false,
        errors: result.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Check for duplicate email
  const emailExists = Users.some((u) => u.email === result.data.email);
  if (emailExists) {
    return Response.json(
      { success: false, message: "this email is already in use" },
      { status: 409 },
    );
  }

  // Strip confirmPassword (never stored) and convert File objects to filenames
  const { confirmPassword, ...data } = result.data;

  const newUser: User =
    data.role === "lawyer"
      ? {
          id: crypto.randomUUID(),
          ...data,
          idCard: (data.idCard as File).name,
          unionCard: (data.unionCard as File).name,
          practiceCertificate: (data.practiceCertificate as File).name,
        }
      : {
          id: crypto.randomUUID(),
          ...data,
        };

  Users.push(newUser);

  return Response.json(
    {
      success: true,
      message: "User added successfully",
      user: newUser,
    },
    { status: 201 },
  );
}