import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import LicenseKey from "@/models/LicenseKey";
import { generateKey } from "@/lib/generateKey";

export async function POST(req) {
  await dbConnect();

  try {
    const { companyId, fiscalYear, key } = await req.json();

    const licenseKey = await LicenseKey.findOne({ key });

    if (!licenseKey || !licenseKey.active) {
      return new NextResponse("Invalid or inactive license key", { status: 400 });
    }

    const expectedKey = generateKey(companyId, fiscalYear);

    if (key !== expectedKey) {
      return new NextResponse("Invalid license key", { status: 400 });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return new NextResponse("Company not found", { status: 404 });
    }

    company.fiscalLock = false;
    await company.save();

    licenseKey.active = false;
    await licenseKey.save();

    return new NextResponse(JSON.stringify({ message: "License key verified and company unlocked" }), { status: 200 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
}
