import { supabase } from "@/../supabase"; // Убедитесь, что путь правильный

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const { data: user, error } = await supabase.auth.api.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: "Invalid token" });
        }

        return res.status(200).json({ message: "Token is valid", user });
    } catch (err) {
        console.error("Validation error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
}
