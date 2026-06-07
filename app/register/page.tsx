import RegisterForm from "@/components/Register";

export default function Registerpage() {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "url('https://img.magnific.com/free-photo/top-view-business-office-desk-background-applying-job-form-pen-pencil-eyeglasses-tree-wooden-table-background-with-copy-space_1921-21.jpg?semt=ais_hybrid&w=740&q=80')",
        backgroundRepeat: "no-repeat",
      }}
    >
      <RegisterForm />
    </div>
  );
}
