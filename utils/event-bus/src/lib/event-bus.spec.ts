import { EventBus } from './event-bus';

enum Events {
  Event1 = 'event1',
  Event2 = 'event2',
}

describe('eventBus', () => {
  const eventBus = EventBus.init();
  const callback1 = jest.fn((data) => {
    console.log('Subscriber 1 received event1 with data:', data);
  });
  const callback2 = jest.fn((data) => {
    console.log('Subscriber 2 received event2 with data:', data);
  });

  it('should be instantiated', () => {
    expect(eventBus).toBeDefined();
    expect(eventBus).toEqual({ listeners: {} });
  });

  it('Should subscribe to events', () => {
    // Subscriber 1
    eventBus.subscribe(Events.Event1, callback1);

    // Subscriber 2
    eventBus.subscribe(Events.Event2, callback2);

    expect(eventBus).toEqual({
      listeners: { [Events.Event1]: [callback1], [Events.Event2]: [callback2] },
    });
  });
});
