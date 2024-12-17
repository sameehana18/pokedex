// pokemon.routes.js
import express from "express";
import upload from "../middleware/multer.middlewares.js";
import cloudinary from "../cloudinary.js";
import fs from "fs";
import Pokemon from "../models/pokemon.models.js"; 

const router = express.Router();

router.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUDINARY_FOLDER_NAME}`,
            resource_type: "auto"
        });

        // Remove the local file after uploading to Cloudinary
        fs.unlinkSync(req.file.path);

        // Create a new Pokémon entry with the uploaded image URL and other details
        const newPokemon = new Pokemon({
            name: req.body.name,
            poke_id: req.body.poke_id,
            type: req.body.type,
            height: req.body.height,
            weight: req.body.weight,
            category: req.body.category,
            abilities: req.body.abilities,
            weakness: req.body.weakness,
            image: result.secure_url // Store the Cloudinary URL in the database
        });

        // Save the new Pokémon entry to MongoDB
        await newPokemon.save();

        res.status(200).send({
            message: "Pokémon uploaded successfully",
            pokemonId: newPokemon._id, // Return the ID of the newly created Pokémon document
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        fs.unlinkSync(req.file.path); // Clean up local file on error
        res.status(400).send({ message: error.message });
    }
});

// Existing GET route for retrieving an image remains unchanged
// router.get("/image/:public_id", async (req, res) => {
//     const { public_id } = req.params;

//     try {
//         const imageUrl = cloudinary.url(public_id, {
//             secure: true,
//         });

//         if (!imageUrl) {
//             return res.status(400).send({ message: "Image not found" });
//         }

//         res.status(200).send({
//             message: "Image retrieved successfully",
//             url: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${process.env.CLOUDINARY_FOLDER_NAME}/${public_id}`
//         });
//     } catch (error) {
//         res.status(400).send({ message: error.message });
//     }
// });

// GET route to retrieve a Pokémon by poke_id or MongoDB _id
router.get("/pokemon/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Try to find by poke_id first
        let pokemon = await Pokemon.findOne({ poke_id: id });

        // If not found by poke_id, try to find by MongoDB _id
        if (!pokemon) {
            pokemon = await Pokemon.findById(id);
        }

        // If Pokémon is not found, return an error
        if (!pokemon) {
            return res.status(404).send({ message: "Pokémon not found" });
        }

        // Return the Pokémon details including image URL
        res.status(200).send({
            message: "Pokémon retrieved successfully",
            data: {
                name: pokemon.name,
                poke_id: pokemon.poke_id,
                type: pokemon.type,
                height: pokemon.height,
                weight: pokemon.weight,
                category: pokemon.category,
                abilities: pokemon.abilities,
                weakness: pokemon.weakness,
                image: pokemon.image // This will be the Cloudinary URL
            }
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


router.put("/pokemon/:id", async (req, res) => {
    const { id } = req.params;
    const { name, poke_id, type, height, weight, category, abilities, weakness } = req.body;

    try {
        const pokemon = await Pokemon.findOne({poke_id: id});

        // If not found by poke_id, try to find by MongoDB _id
        if (!pokemon) {
            pokemon = await Pokemon.findById(id);
        }

        // If Pokémon is not found, return an error
        if (!pokemon) {
            return res.status(404).send({ message: "Pokémon not found" });
        }

        const updatedPokemon = await Pokemon.findOneAndUpdate(
            { poke_id: id },
            req.body,
            { new: true }
        );

        res.status(200).json(updatedPokemon);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

router.get("/count", async (req, res) => {
    try {
        const cnt = await Pokemon.countDocuments();

        res.status(200).json({cnt});
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
})

export default router;
