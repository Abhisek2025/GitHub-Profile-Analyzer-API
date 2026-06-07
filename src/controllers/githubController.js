import axios from "axios";
import db from "../config/db.js";

export const analyzeProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const { data: user } = await axios.get(
      `https://api.github.com/users/${username}`
    );

    const accountAge =
      new Date().getFullYear() -
      new Date(user.created_at).getFullYear();

    const popularityScore =
      user.followers * 2 +
      user.public_repos * 1.5 -
      user.following;

    const followerRatio =
      user.following === 0
        ? user.followers
        : (user.followers / user.following).toFixed(2);

    await db.execute(
      `INSERT INTO github_profiles
      (
        username,
        name,
        bio,
        public_repos,
        followers,
        following,
        company,
        location,
        blog,
        account_age_years,
        popularity_score
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      bio = VALUES(bio),
      public_repos = VALUES(public_repos),
      followers = VALUES(followers),
      following = VALUES(following),
      company = VALUES(company),
      location = VALUES(location),
      blog = VALUES(blog),
      account_age_years = VALUES(account_age_years),
      popularity_score = VALUES(popularity_score)
      `,
      [
        user.login,
        user.name,
        user.bio,
        user.public_repos,
        user.followers,
        user.following,
        user.company,
        user.location,
        user.blog,
        accountAge,
        popularityScore,
      ]
    );

    res.status(200).json({
      success: true,
      username: user.login,
      name: user.name,
      followers: user.followers,
      following: user.following,
      publicRepos: user.public_repos,
      accountAge,
      followerRatio,
      popularityScore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProfiles = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM github_profiles ORDER BY analyzed_at DESC"
    );

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfileById = async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT * FROM github_profiles WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};