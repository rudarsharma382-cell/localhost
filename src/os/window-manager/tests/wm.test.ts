import { useOSStore } from '../store';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ Test failed: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✓ ${msg}`);
  }
}

function runTests() {
  console.log('\n--- Running Window Manager Unit Tests ---\n');

  const store = useOSStore.getState();

  // 1. Initial State
  assert(store.windows.length === 0, 'Initially zero windows open');

  // 2. Open First Window (Studio)
  const id1 = store.openWindow('studio');
  let state = useOSStore.getState();
  assert(state.windows.length === 1, 'Opens 1 window');
  assert(state.windows[0].id === id1, 'Window has correct id');
  assert(state.windows[0].focused === true, 'New window is focused');
  const z1 = state.windows[0].z;

  // 3. Open Second Window (Browser)
  const id2 = store.openWindow('browser');
  state = useOSStore.getState();
  assert(state.windows.length === 2, 'Opens second window');
  const win1 = state.windows.find((w) => w.id === id1)!;
  const win2 = state.windows.find((w) => w.id === id2)!;
  assert(!win1.focused, 'First window loses focus');
  assert(win2.focused, 'Second window is focused');
  assert(win2.z > win1.z, 'Second window has higher z-index');

  // 4. Focus First Window
  store.focusWindow(id1);
  state = useOSStore.getState();
  const focusedWin1 = state.windows.find((w) => w.id === id1)!;
  const focusedWin2 = state.windows.find((w) => w.id === id2)!;
  assert(focusedWin1.focused, 'First window regained focus');
  assert(!focusedWin2.focused, 'Second window lost focus');
  assert(focusedWin1.z > focusedWin2.z, 'Focused window raised to top z-index');

  // 5. Single-instance enforcement
  const reId1 = store.openWindow('studio');
  state = useOSStore.getState();
  assert(state.windows.length === 2, 'Single instance app does not duplicate window');
  assert(reId1 === id1, 'Returns existing window id');

  // 6. Maximize and Restore
  const prevBounds = { x: focusedWin1.x, y: focusedWin1.y, w: focusedWin1.w, h: focusedWin1.h };
  store.toggleMaximizeWindow(id1);
  state = useOSStore.getState();
  const maxWin1 = state.windows.find((w) => w.id === id1)!;
  assert(maxWin1.maximized, 'Window is maximized');
  assert(maxWin1.prevBounds !== undefined, 'Window saved previous bounds');

  store.toggleMaximizeWindow(id1);
  state = useOSStore.getState();
  const restWin1 = state.windows.find((w) => w.id === id1)!;
  assert(!restWin1.maximized, 'Window is restored');
  assert(restWin1.w === prevBounds.w && restWin1.h === prevBounds.h, 'Restored bounds match original dimensions');

  // 7. Minimize & Focus Shift
  store.minimizeWindow(id1);
  state = useOSStore.getState();
  const minWin1 = state.windows.find((w) => w.id === id1)!;
  const curWin2 = state.windows.find((w) => w.id === id2)!;
  assert(minWin1.minimized, 'Window is marked minimized');
  assert(!minWin1.focused, 'Minimized window is not focused');
  assert(curWin2.focused, 'Focus transferred to next highest active window');

  // 8. Restore from minimized via openWindow / restore
  store.openWindow('studio');
  state = useOSStore.getState();
  const unminWin1 = state.windows.find((w) => w.id === id1)!;
  assert(!unminWin1.minimized, 'Single-instance call restores minimized window');
  assert(unminWin1.focused, 'Restored window is focused');

  // 9. Close Window
  store.closeWindow(id1);
  state = useOSStore.getState();
  assert(state.windows.length === 1, 'Closed window is removed from list');
  assert(state.windows[0].id === id2, 'Remaining window is preserved');

  console.log('\n✓ All 9 Window Manager assertions passed successfully!\n');
}

runTests();
