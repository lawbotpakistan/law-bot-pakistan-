export default async function handler(req, res) {
  try {
    return res.status(200).json({ ok: true, msg: "Server is alive ✅" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
