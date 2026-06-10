const { PrismaClient, RoleKey } = require("@prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const prisma = new PrismaClient();
  try {
    const email = "super@fceo.local";
    const regNo = "FCEO/ADMIN/0001";
    const password = "admin123"; // demo only
    const hashedPassword = await bcrypt.hash(password, 12);

    const existingByEmail = await prisma.user.findFirst({ where: { email } });
    const existingByReg = await prisma.user.findFirst({ where: { regNo } });

    const payload = {
      fullName: "Demo Super Admin",
      email,
      regNo,
      roleKey: RoleKey.SUPER_ADMIN,
      roleLabel: "Super Admin",
      avatarDataUrl: null,
      password: hashedPassword,
    };

    if (existingByEmail || existingByReg) {
      const id = (existingByEmail || existingByReg).id;
      const updated = await prisma.user.update({ where: { id }, data: payload });
      console.log("Updated SUPER_ADMIN user:", { id: updated.id, email: updated.email, regNo: updated.regNo });
    } else {
      const created = await prisma.user.create({ data: payload });
      console.log("Created SUPER_ADMIN user:", { id: created.id, email: created.email, regNo: created.regNo });
    }
  } finally {
    await new PrismaClient().$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
