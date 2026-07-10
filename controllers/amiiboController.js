import axios from "axios";

import {
  getWishlist,
  getCollection,
  saveWishlist,
  saveCollection
} from "../models/userModel.js";

import {
  getUserReviews
} from "../models/reviewModel.js";

const API_URL = "https://amiiboapi.org/api/amiibo/";

export async function getAllAmiibos(req, res, next) {
  try {
    const response = await axios.get(API_URL);
    const amiibos = response.data.amiibo.slice(0, 60);

    let wishlistIds = [];
    let collectionIds = [];

    if (req.session.user) {
      const userId = req.session.user.userId;

      const [wishlistRows, collectionRows] = await Promise.all([
        getWishlist(userId),
        getCollection(userId)
      ]);

      wishlistIds = wishlistRows.map(
        (row) => `${row.amiibo_head}-${row.amiibo_tail}`
      );

      collectionIds = collectionRows.map(
        (row) => `${row.amiibo_head}-${row.amiibo_tail}`
      );
    }

    return res.render("amiibos/index", {
      title: "Browse Amiibos",
      amiibos,
      wishlistIds,
      collectionIds,
      currentUser: req.session.user || null
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateWishlist(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "You must log in first."
      });
    }

    const { head, tail, selected } = req.body;

    if (!head || !tail || typeof selected !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid wishlist request."
      });
    }

    await saveWishlist(
      req.session.user.userId,
      head,
      tail,
      selected
    );

    return res.json({
      success: true,
      selected
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateCollection(req, res, next) {
  try {
    if (!req.session.user) {
      return res.status(401).json({
        success: false,
        message: "You must log in first."
      });
    }

    const { head, tail, selected } = req.body;

    if (!head || !tail || typeof selected !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid collection request."
      });
    }

    await saveCollection(
      req.session.user.userId,
      head,
      tail,
      selected
    );

    return res.json({
      success: true,
      selected
    });
  } catch (error) {
    return next(error);
  }
}

export async function showWishlist(req, res, next) {
  try {
    const userId = req.session.user.userId;

    const [wishlistRows, response] = await Promise.all([
      getWishlist(userId),
      axios.get(API_URL)
    ]);

    const wishlistIds = new Set(
      wishlistRows.map(
        (row) => `${row.amiibo_head}-${row.amiibo_tail}`
      )
    );

    const amiibos = response.data.amiibo.filter((amiibo) =>
      wishlistIds.has(`${amiibo.head}-${amiibo.tail}`)
    );

    return res.render("collections/wishlist", {
      title: "My Wishlist",
      amiibos
    });
  } catch (error) {
    return next(error);
  }
}

export async function showCollection(req, res, next) {
  try {
    const userId = req.session.user.userId;

    const [
      collectionRows,
      reviewRows,
      response
    ] = await Promise.all([
      getCollection(userId),
      getUserReviews(userId),
      axios.get(API_URL)
    ]);

    const collectionIds = new Set(
      collectionRows.map(
        (row) => `${row.amiibo_head}-${row.amiibo_tail}`
      )
    );

    const amiibos = response.data.amiibo.filter((amiibo) =>
      collectionIds.has(`${amiibo.head}-${amiibo.tail}`)
    );

    const reviewMap = {};

    reviewRows.forEach((review) => {
      const amiiboId =
        `${review.amiibo_head}-${review.amiibo_tail}`;

      reviewMap[amiiboId] = review;
    });

    return res.render("collections/collection", {
      title: "My Collection",
      amiibos,
      reviewMap
    });
  } catch (error) {
    return next(error);
  }
}