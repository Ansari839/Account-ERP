import dbConnect from "@/lib/dbConnect";
import Company from "@/models/Company";
import { NextResponse } from "next/server";

export async function getCompany() {
  try {
    await dbConnect();
    const company = await Company.findOne().sort({ createdAt: -1 });
    return NextResponse.json(company || null);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function createOrUpdateCompany(req) {
  try {
    await dbConnect();
    const body = await req.json();
    // If id provided -> update, else create or upsert single company
    if (body.id) {
      const updated = await Company.findByIdAndUpdate(body.id, body, { new: true, upsert: true });
      return NextResponse.json(updated);
    } else {
      // If a company exists, update it; otherwise create
      let company = await Company.findOne();
      if (company) {
        company = await Company.findByIdAndUpdate(company._id, body, { new: true });
      } else {
        company = await Company.create(body);
      }
      return NextResponse.json(company);
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}