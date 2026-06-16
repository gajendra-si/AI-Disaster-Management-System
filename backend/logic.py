def get_severity(type, description):
    text = description.lower()

    if type.lower() == "fire":
        if "building" in text:
            return "HIGH"
        return "MEDIUM"

    if type.lower() == "flood":
        return "HIGH"

    return "LOW"