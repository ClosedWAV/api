class EncryptionService {
    encrypt = async (password: string) => await Bun.password.hash(password);

    verify = async (password: string, hash: string) => await Bun.password.verify(password, hash);
}

export const encryption = new EncryptionService();