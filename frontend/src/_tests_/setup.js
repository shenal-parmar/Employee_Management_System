import { vi } from 'vitest';

// Declare the mock function globally in this setup file
const mockApiPost = vi.fn();
export { mockApiPost }; // Export it so your test can import and assert on it

// Global Mock for the API module
// This mock is guaranteed to apply before any file imports '../src/api/api.js'
vi.mock('../src/api/api.js', () => ({
    default: {
        post: mockApiPost,
        get: vi.fn(), // Add other methods the component might use
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

// Set the default success implementation here for the Login test
beforeEach(() => {
    // Reset call history for the post mock
    mockApiPost.mockReset(); 
    
    // Set the mock data for a successful login response
    mockApiPost.mockResolvedValue({
        data: {
            success: true,
            token: "fake-token",
            user: { role: "admin", name: "Tester" }
        },
    });
});