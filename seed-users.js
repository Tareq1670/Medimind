// Seed demo users through Better Auth's sign-up API
const DEMO_USERS = [
  { name: "Patient Demo", email: "patient@medimind.demo", password: "Demo@1234", role: "user" },
  { name: "Doctor Demo", email: "doctor@medimind.demo", password: "Demo@1234", role: "doctor" },
  { name: "Admin Demo", email: "admin@medimind.demo", password: "Admin@1234", role: "admin" },
];

async function seed() {
  for (const u of DEMO_USERS) {
    try {
      const res = await fetch("http://localhost:3000/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: u.name,
          email: u.email,
          password: u.password,
          role: u.role,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`✓ Created ${u.email} (${u.role})`);
      } else if (data.code === "USER_ALREADY_EXISTS") {
        console.log(`~ ${u.email} already exists`);
      } else {
        console.log(`✗ ${u.email}: ${data.message || data.code || res.status}`);
      }
    } catch (err) {
      console.error(`✗ ${u.email}: ${err.message}`);
    }
  }
}

seed().then(() => console.log("Done")).catch(console.error);
