const { PrismaClient, RoleKey } = require("@prisma/client");

async function main() {
  const prisma = new PrismaClient();
  try {
    const email = "super@fceo.local";
    const regNo = "FCEO/ADMIN/0001";
    const password = "admin123"; // demo only

    const existingByEmail = await prisma.demoUser.findFirst({ where: { email } });
    const existingByReg = await prisma.demoUser.findFirst({ where: { regNo } });

    const payload = {
      fullName: "Demo Super Admin",
      email,
      regNo,
      roleKey: RoleKey.SUPER_ADMIN,
      roleLabel: "Super Admin",
      avatarDataUrl: null,
      password,
    };

    if (existingByEmail || existingByReg) {
      const id = (existingByEmail || existingByReg).id;
      const updated = await prisma.demoUser.update({ where: { id }, data: payload });
      console.log("Updated demo SUPER_ADMIN:", { id: updated.id, email: updated.email, regNo: updated.regNo });
    } else {
      const created = await prisma.demoUser.create({ data: payload });
      console.log("Created demo SUPER_ADMIN:", { id: created.id, email: created.email, regNo: created.regNo });
    }
  } finally {
    await new PrismaClient().$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


