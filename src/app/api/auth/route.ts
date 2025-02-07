import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		if (body.email === "muhibraza04@gmail.com") {
			return NextResponse.json({
				message: "Valid User",
				redirectUrl: "/admin",
			});
		} else {
			return NextResponse.json({
				message: "Valid User",
				redirectUrl: "/",
			});
		}
	} catch (err) {
		// You can log the error if needed
		console.error(err);
		return NextResponse.json({
			message: "Invalid User",
		});
	}
}