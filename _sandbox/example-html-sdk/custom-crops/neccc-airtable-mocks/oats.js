const neccc_oats = () => {return {
    id: 3,
    label: "Oats, Winter",
    group: {
        label: "Small Grains"
    }, 
    attributes: {
        "Coefficients": {
            "High Fertility Competition Coefficient": { values: ["0.6"] },
            "Low Fertility Competition Coefficient": { values: ["0.7"] },
            // "High Fertility Monoculture Coefficient": { values: [] },
            // "Low Fertility Monoculture Coefficient": { values: [] },
            "Single Species Seeding Rate": { values: ["80"] },
            "Broadcast with Cultivation Coefficient": { values: ["1.10"] },
            "Broadcast with No Cultivation Coefficient": { values: ["1.50"] },
            // "Aerial Coefficient": { values: [] },
        },
        "Planting": {
            "Seeds Per lb": { values: ["19400"] },
            // "Planting Methods": { values: [] },
        },  
        "Soil Conditions": {
            "Soil Drainage": { values: [
                "Somewhat poorly drained",
                "Moderately well drained",
                "Well drained",
                "Excessively drained",
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
