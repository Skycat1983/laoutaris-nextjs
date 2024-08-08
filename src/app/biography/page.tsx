import dbConnect from "@/utils/mongodb";

export default async function Biography() {
  await dbConnect();
  // const url = "http://localhost:5001/api/";
  // const res = await fetch(url);
  // console.log("res :>> ", res);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>biogrpahy</h1>
    </main>
  );
}
