import 'zone.js';
import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';
import { beforeEach } from 'vitest';

// Initialize the Angular testing environment only once
try {
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting(),
    {
      teardown: { destroyAfterEach: false }
    }
  );
} catch (e) {
  // Already initialized
}

// Reset TestBed before each test to ensure isolation
beforeEach(() => {
  TestBed.resetTestingModule();
});

