var path = require('path');
var fs = require('fs');

// h/t: https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9781449327453/ch04s07.html
var ISO_DATE_PATTERN = '^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$';

var JAM_ID_PATTERN = '[\w]+\.[\w]+\.[\w]+';


var CONFIG = {
    "type": "jsonschema",
    "schema": {
        "id": "config",
        "type": "object",
        "properties": {
            "accountsMin": {
                "id": "profilesMin",
                "type": "integer"
            },
            "accountsMax": {
                "id": "profilesMin",
                "type": "integer"
            }
        },
        "additionalProperties": false
    }
};

var EXPERIMENT = {
    "type": "jsonschema",
    "schema": {
        "id": "experiment",
        "type": "object",
        "properties": {
            "id": {
                "id": "id",
                "type": "string"
            },
            "title": {
                "id": "title",
                "type": "string"
            },
            "description": {
                "id": "description",
                "type": "string"
            },
            "state": {
                "id": "state",
                "type": "string",
                "enum": ["Draft", "Active", "Archived", "Deleted"]
            },
            "beginDate": {
                "id": "beginDate",
                "format": "date-time",
                "type": "string"
            },
            "endDate": {
                "id": "endDate",
                "format": "date-time",
                "type": "string"
            },
            "lastEdited": {
                "id": "lastEdited",
                "format": "date-time",
                "type": "string"
            },
            "structure": {
                "id": "structure",
                "type": "array",
                "items": {
                    "type": "object"
                }
            },
            "eligibilityCriteria": {
                "id": "eligibilityCriteria",
                "type": "object"
            }
        },
        "required": [
            "structure",
            "state"
        ],
        "additionalProperties": false
    }
};

/*  TODO
var SESSION = {
    "type": "jsonschema",
    "schema": {
        "id": "sessiontest0",  // Script creates one particular session collection associated with one single experiment
        "type": "object",
        "properties": {
            "id": {
                "id": "id",
                "type": "string"
            },
            "profileId": {
                "id": "profileId",
                "type": "string",
                "pattern": JAM_ID_PATTERN
            },
            "profileVersion": {
                "id": "profileVersion",
                "type": "string"
            },
            "experimentId": {  // TODO: In the new collection-per-experiment sessions model, this field may be redundant
                "id": "experimentId",
                "type": "string",
                "pattern": JAM_ID_PATTERN
            },
            "experimentVersion": {
                "id": "experimentVersion",
                "type": "string"
            },
            "parameters": {
                "id": "parameters",
                "type": "object"
            },
            "softwareVersion": {
                "id": "softwareVersion",
                "type": "string"  // TODO pattern? semver?
            },
            "expData": {
                "id": "expData",
                "type": "object"
            }
        },
        "required": [
            "profileId", "profileVersion",
            "experimentId", "experimentVersion",
            "parameters", "softwareVersion",
            "expData"
        ],
        "additionalProperties": false
    }
};
*/

var ACCOUNT = {
    "schema": {
        "definitions": {
            "profile": {
                "type": "object",
                "properties": {
                    "profileId": {
                        "type": "string"
                    },
                    "firstName": {
                        "type": "string",
                        "pattern": "^\w{3,64}"
                    },
                    "birthday": {
                        "type": "string",
                        "pattern": ISO_DATE_PATTERN
                    }
                },
                "required": ["firstName", "birthday"]
            }
        },
        "$schema": "http://json-schema.org/draft-04/schema#",

        "id": "account",
        "type": "object",
        "properties": {
            "id": {
                "type": "string"
            },
            "username": {  // TODO can this be an id?
                "type": "string"
                // # "pattern": commonregex.email.pattern
            },
            "password": {
                "type": "string",
                "pattern": "^\$2b\$1[0-3]\$\S{53}$"
            },
            "profiles": {
                "type": "array",  // Could also do this as an object, as long as keys were guaranteed unique
                "items": {
                    "$ref": "#/definitions/profile"
                }
            }
        },
        "required": ["username", "password"],
        "additionalProperties": false
    }
};

module.exports = function main() {
    [CONFIG, EXPERIMENT, ACCOUNT].forEach(function(schema) {
        var schemaData = JSON.stringify(schema, null, 4);
        var base = path.dirname(__filename);
        var filename = schema.schema.id;
        fs.writeFile(`${base}/../schemas/${filename}.json`, schemaData);
    });
};
