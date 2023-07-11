const neccc_rapeseed = () => {return {
    id: 1,
    label: "Rapeseed, Forage",
    group: {
        label: "Brassica"
    }, 
    attributes: {
        "Coefficients": {
            // "High Fertility Competition Coefficient": { values: [] },
            // "Low Fertility Competition Coefficient": { values: [] },
            // "High Fertility Monoculture Coefficient": { values: [] },
            // "Low Fertility Monoculture Coefficient": { values: [] },
            "Single Species Seeding Rate": { values: ["7"] },
            // "Broadcast with Cultivation Coefficient": { values: [] },
            // "Broadcast with No Cultivation Coefficient": { values: [] },
            // "Aerial Coefficient": { values: [] },
        },
        "Planting": {
            "Seeds Per lb": { values: ["157000"] },
            // "Planting Methods": { values: [] },
        },  
        "Soil Conditions": {
            "Soil Drainage": { values: [
                "Somewhat poorly drained",
                "Moderately well drained",
                "Well drained",
                "Well drained muck",
                "Somewhat Excessively Drained",
            ] },
            // "Soil Fertility": { values: [] },
        },  
        "Planting and Growth Windows": {
            "Reliable Establishment": { values: [] },
            "Freeze/Moisture Risk to Establishment": { values: [] },
            // "Early Seeding Date": { values: [] },
            // "Late Seeding Date": { values: [] },
            // "Average Frost": { values: [] },
        },  
    }
}}

module.exports = neccc_rapeseed();