// att(s) == 键值对

var checkerDataRCI = {
  "requires": [
    {
      "key": "id",
      "type": "string"
    },
    {
      "key": "type",
      "type": "string",
      "restricted": true,
      "restrict_type": "string",
      "values": ["residential", "commercial", "industrial", "decoration"]
    },
    {
      "key": "width",
      "type": "integer",
      "restricted": true,
      "restrict_type": "number",
      "minimum": 1,
      "maximum": 16
    },
    {
      "key": "height",
      "type": "integer",
      "restricted": true,
      "restrict_type": "number",
      "minimum": 1,
      "maximum": 16
    },
    {
      "key": "frames",
      "type": "array"
    }
  ],
  "main": [
    {
      "key": "draw ground",
      "type": "boolean",
      "suggested": true,
      "restricted": true,
      "restrict_type": "suggestion",
      "suggestions": [
        {
          "type": "type_bool",
          "value": true
        }
      ]
    },
    {
      "key": "influence"
    }
  ],
  "extension": [
    {
      "name": "templete_requirement",
      "type": "value_difference",
      "key1": "width",
      "key2": "height",
      "difference_type": "multiple",
      "minimum": 0.5,
      "maximum": 2
    },
    {
       
    }
  ]
}
