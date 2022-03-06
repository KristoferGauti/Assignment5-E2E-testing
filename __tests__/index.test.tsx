import React from "react";
import "@testing-library/jest-dom";
import Home from "../pages/index";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";

// Mock API is global
const server = setupServer(
    rest.get("/api/list", (req, res, ctx) => {
        return res(
            ctx.json([
                {
                    id: "Kristofer Gauti",
                    title: "hello there",
                },
            ])
        );
    }),
    rest.post("/api/add", (req, res, ctx) => {
        return res(ctx.json({ id: "new todo", title: "homie is sleepy" }));
    }),
    rest.delete("/api/remove", (req, res, ctx) => {
        return res(ctx.json({ id: "new todo", title: "homie is sleepy" }));
    })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Component tests", () => {
    test("Loading component is displayed when the response is not correct", async () => {
        server.use(
            rest.get("/api/list", (req, res, ctx) => {
                return res(ctx.json(null));
            })
        );
        render(<Home />);
        await waitFor(() => {
            return expect(screen.getByTestId("loading")).toBeInTheDocument();
        });
    });
    test("A single item is in the list when the <Home /> component is loaded", async () => {
        render(<Home />);
        await waitFor(() => {
            return expect(screen.getByTestId("todo-item")).toBeInTheDocument();
        });
    });
    test("Adds a new item to the list", async () => {
        render(<Home />);
        await waitFor(() => {
            return expect(screen.getByTestId("todo-item")).toBeInTheDocument();
        });
        await waitFor(async () => {
            const todoInput = await screen.findByTestId("todo-input");
            fireEvent.change(todoInput, {
                target: {
                    value: "Practice the violin",
                },
            });
            fireEvent.submit(todoInput);
        });
        await waitFor(() => {
            return expect(screen.getAllByTestId("todo-item")).toHaveLength(2);
        });
    });
    test("Removes an item from the list", async () => {
        render(<Home />);
        await waitFor(() => {
            return expect(screen.getByTestId("todo-item")).toBeInTheDocument();
        });
        await waitFor(async () => {
            const todoItem = await screen.findByTestId("todo-item"); // findByTestId is async function
            fireEvent.click(todoItem);
        });
        await waitFor(() => {
            return expect(screen.queryAllByTestId("todo-item")).toHaveLength(0);
        });
    });
});
