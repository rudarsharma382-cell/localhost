import { queryAssistant, normalizeQuery, detectEntity } from '../engine';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Test failed: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✓ ${msg}`);
  }
}

function runTests() {
  console.log('\n--- Running Rudar AI Assistant Engine Tests ---\n');

  // 1. Normalization & Synonyms
  const norm1 = normalizeQuery('What stuff has he built?');
  assert(norm1.includes('projects'), 'Maps "stuff" to "projects"');

  const norm2 = normalizeQuery('How can I reach him?');
  assert(norm2.includes('contact'), 'Maps "reach" to "contact"');

  // 2. Verified Question: Identity
  const resIdentity = queryAssistant('Who is Rudar Sharma?');
  assert(resIdentity.answer.includes('Flutter and app developer'), 'Answers verified identity accurately');
  assert(!resIdentity.isFallback, 'Identity question is not a fallback');

  // 3. Verified Question: Hackathon Achievement
  const resHackathon = queryAssistant('What awards has he won?');
  assert(resHackathon.answer.includes('Top 140'), 'Includes verified Top 140 achievement');
  assert(resHackathon.answer.includes('Delhi AI Grand Hackathon'), 'Identifies Delhi AI Hackathon');

  // 4. Data-composed project query
  const resProj = queryAssistant('Tell me about SafeWare');
  assert(resProj.answer.includes('road safety'), 'SafeWare summary answered');
  assert(resProj.resolvedEntity === 'safeware', 'Entity resolved to safeware');

  // 5. Follow-up query resolution
  const resFollowUp = queryAssistant('What tech stack does it use?', { lastEntityId: 'safeware' });
  assert(resFollowUp.answer.includes('Flutter'), 'Follow-up resolves last entity stack');
  assert(resFollowUp.answer.includes('Computer Vision'), 'Follow-up includes CV');

  // 6. Unknown question honesty test (Anti-slop / No hallucination)
  const resUnknown = queryAssistant('What is Rudar\'s favorite food and dog breed?');
  assert(resUnknown.isFallback === true, 'Unknown question triggers honest fallback');
  assert(resUnknown.answer.includes("I don't have that verified in my knowledge base"), 'Does not invent facts');
  assert(resUnknown.followUps !== undefined && resUnknown.followUps.length > 0, 'Offers suggested verified questions');

  console.log('\n✓ All 6 Assistant Engine assertions passed successfully!\n');
}

runTests();

