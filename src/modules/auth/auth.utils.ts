import bcrypt from 'bcrypt';

export class AuthUtils {
  /**
   * Hash password using bcrypt
   * @param password
   */
  public static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  /**
   * Compare clear password with bcrypt hashed password.
   * @param password Clear text password
   * @param hashedPassword Hashed password
   * @returns true if equal, false if not.
   */
  public static async comparePassword(
    password: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
