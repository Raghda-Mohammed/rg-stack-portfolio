// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContactForm } from "@/components/contact-form";
import { I18nProvider } from "@/lib/i18n";

function renderForm() {
  return render(
    <I18nProvider>
      <ContactForm />
    </I18nProvider>,
  );
}

describe("<ContactForm />", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: true, id: 1 }), {
            status: 201,
          }),
      ),
    );
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows validation errors and does not submit when required fields are empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/please enter your name/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/please enter your email/i)).toBeInTheDocument();

    expect(
      screen.getByText(/please write a short message/i),
    ).toBeInTheDocument();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a format error for an invalid email without flagging it as empty", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: /^name$/i }),
      "Sara Ahmed",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^email$/i }),
      "not-an-email",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^message$/i }),
      "Hello, I would like to talk about a full-stack project opportunity.",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/doesn't look right/i)).toBeInTheDocument();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("shows a length error for a message under 20 characters", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: /^name$/i }),
      "Sara Ahmed",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^email$/i }),
      "sara@example.com",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^message$/i }),
      "too short",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/at least 20 characters/i),
    ).toBeInTheDocument();
  });

  it("submits a valid form and shows the success state", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: /^name$/i }),
      "Sara Ahmed",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^email$/i }),
      "sara@example.com",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^message$/i }),
      "Hello, I would like to talk about a full-stack project opportunity.",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

    const [, init] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];

    const sentBody = JSON.parse(init.body as string);

    expect(sentBody).toMatchObject({
      name: "Sara Ahmed",
      email: "sara@example.com",
      locale: "en",
    });

    expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
  });

  it("shows a generic error and stays on the form when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response(JSON.stringify({ ok: false }), {
            status: 500,
          }),
      ),
    );

    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: /^name$/i }),
      "Sara Ahmed",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^email$/i }),
      "sara@example.com",
    );

    await user.type(
      screen.getByRole("textbox", { name: /^message$/i }),
      "Hello, I would like to talk about a full-stack project opportunity.",
    );

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /something went wrong/i,
    );
  });
});
