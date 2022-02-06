export const stringScenarios = [
  ['market*', 'marketplaceOffers', true],
  ['aws.*', 'aws.ec2', true],
  ['*.postfix', 'service.postfix', true],
  ['*.postfix', 'service.postmix', false],
  ['market*', 'elephant', false],
  ['*narwhal', 'goose', false],
  ['cool*beans', 'coolxbeans', true],
  ['cool*beans', 'coolxbeanz', false],
  ['*beans', 'coolxbeans', true],
  ['beans', 'coolxbeans', false],
];

export const nestedScenarios = [
  [
    { requestContext: { http: { method: 'POST' } } },
    { requestContext: { http: { method: 'POST' } } },
    true,
  ],
  [
    { requestContext: { http: { method: '*' } } },
    { requestContext: { http: { method: 'POST' } } },
    true,
  ],
];
