const express = require('express');
const { EventProfile, EventValidator } = require('openepcis-event-sentry');

const app = express();
app.use(express.json()); // Middleware for parsing JSON

// Example Event Profile Rules (Customizable)
const exampleRules = {
  type: 'object',
  required: ['eventType', 'bizStep', 'readPoint', 'epcList'],
  properties: {
    eventType: { type: 'string', enum: ['ObjectEvent'] },
    bizStep: { type: 'string' },
    readPoint: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
    epcList: { type: 'array', items: { type: 'string' } },
  },
};

// Initialize Event Validator
const eventProfile = new EventProfile('ExampleProfile', exampleRules);
const validator = new EventValidator(eventProfile);

// Sample API Endpoint to Validate EPCIS Event
app.post('/validate-event', (req, res) => {
  const epcisEvent = req.body;

  try {
    const result = validator.validate(epcisEvent);
    res.status(200).json({ message: 'Event is valid!', details: result });
  } catch (error) {
    res.status(400).json({ message: 'Event validation failed', error: error.message });
  }
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
