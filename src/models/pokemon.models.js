import mongoose, { Schema } from "mongoose";

const pokemonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    poke_id: {
        type: Number,
        required: true,
        unique: true 
    },
    type: {
        type: [String], 
        required: true
    },
    height: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    abilities: {
        type: [String], 
        required: true
    },
    weakness: {
        type: [String], 
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

const Pokemon = mongoose.model("Pokemon", pokemonSchema);
export default Pokemon;
