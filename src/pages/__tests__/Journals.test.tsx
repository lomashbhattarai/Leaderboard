import React from "react";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Journals from "../Journals";
import {
  useCreateJournal,
  useDeleteJournal,
  useJournals,
  useUpdateJournal,
} from "../../api/queries";
import { renderWithProviders } from "../../test-utils/render";
import { mockJournals } from "../../test-utils/mockData";

jest.mock("../../api/queries", () => ({
  useJournals: jest.fn(),
  useCreateJournal: jest.fn(),
  useUpdateJournal: jest.fn(),
  useDeleteJournal: jest.fn(),
}));

const mockedUseJournals = jest.mocked(useJournals);
const mockedUseCreateJournal = jest.mocked(useCreateJournal);
const mockedUseUpdateJournal = jest.mocked(useUpdateJournal);
const mockedUseDeleteJournal = jest.mocked(useDeleteJournal);

describe("Journals page", () => {
  const createJournal = jest.fn();
  const updateJournal = jest.fn();
  const deleteJournal = jest.fn();

  beforeEach(() => {
    mockedUseJournals.mockReturnValue({ data: mockJournals } as any);
    mockedUseCreateJournal.mockReturnValue({ mutateAsync: createJournal } as any);
    mockedUseUpdateJournal.mockReturnValue({ mutateAsync: updateJournal } as any);
    mockedUseDeleteJournal.mockReturnValue({ mutateAsync: deleteJournal } as any);
  });

  it("renders journal list", () => {
    renderWithProviders(<Journals />, { authState: "authenticated" });

    expect(screen.getByTestId("journal-list")).toBeInTheDocument();
    expect(screen.getByTestId("journal-row")).toBeInTheDocument();
    expect(screen.getByText("Market Review")).toBeInTheDocument();
    expect(screen.getByText(/nabil strength/i)).toBeInTheDocument();
  });

  it("can submit a journal entry with mocked mutation", async () => {
    renderWithProviders(<Journals />, { authState: "authenticated" });

    await userEvent.click(screen.getByRole("button", { name: /add/i }));
    await userEvent.type(
      screen.getByLabelText(/content/i),
      "A disciplined entry for regression coverage."
    );
    await userEvent.click(screen.getByRole("button", { name: /create journal/i }));

    await waitFor(() =>
      expect(createJournal).toHaveBeenCalledWith(
        expect.objectContaining({
          content: "A disciplined entry for regression coverage.",
          journalType: "general",
        })
      )
    );
  });

  it("can delete a journal entry", async () => {
    window.confirm = jest.fn(() => true);
    renderWithProviders(<Journals />, { authState: "authenticated" });

    await userEvent.click(screen.getByRole("button", { name: /delete/i }));

    expect(deleteJournal).toHaveBeenCalledWith(mockJournals[0].id);
  });

  it("handles empty state", () => {
    mockedUseJournals.mockReturnValue({ data: [] } as any);

    renderWithProviders(<Journals />, { authState: "authenticated" });

    expect(screen.getByText(/no journal entries yet/i)).toBeInTheDocument();
  });
});
