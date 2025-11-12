import { UserRepository } from "@/modules/users/user.repository";
import {
  type CreateUserDTO,
  type UpdateUserDTO,
  type UserQueryParams,
  type UserWithoutPassword,
} from "@/modules/users/user.types";
import { ConflictError, NotFoundError } from "@/errors";
import { ERROR_MESSAGES } from "@/shared/constants";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserDTO): Promise<UserWithoutPassword> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password
    // const hashedPassword = await PasswordHelper.hash(data.password);

    // Create user
    return this.userRepository.create({
      ...data,
      // password: hashedPassword,
    });
  }

  async getUserById(id: string): Promise<UserWithoutPassword> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    id: string,
    data: UpdateUserDTO,
  ): Promise<UserWithoutPassword> {
    // Check if user exists
    const exists = await this.userRepository.exists(id);

    if (!exists) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // If email is being updated, check if it's already taken
    if (data.email) {
      const existingUser = await this.userRepository.findByEmail(data.email);

      if (existingUser && existingUser.id !== id) {
        throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }
    }

    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<void> {
    const exists = await this.userRepository.exists(id);

    if (!exists) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    await this.userRepository.delete(id);
  }

  async getAllUsers(
    params: UserQueryParams,
  ): Promise<{ users: UserWithoutPassword[]; total: number }> {
    const { users, total } = await this.userRepository.findAll(params);

    return {
      users,
      total,
    };
  }

  // private excludePassword(user: User): UserWithoutPassword {
  //   const { password, ...userWithoutPassword } = user;

  //   return userWithoutPassword;
  // }
}
