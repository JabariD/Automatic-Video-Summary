class UserValidator {
  public async validate(email: string): Promise<boolean> {
    if (email === "") {
      return false;
    }

    // TODO(JabariD): Validate user by calling Stripe API.

    return true;
  }
}

export { UserValidator };
