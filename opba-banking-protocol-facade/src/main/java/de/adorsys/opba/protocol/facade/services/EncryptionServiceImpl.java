package de.adorsys.opba.protocol.facade.services;

import com.google.crypto.tink.Aead;
import com.google.crypto.tink.subtle.AesGcmJce;
import de.adorsys.opba.protocol.api.services.EncryptionService;
import lombok.SneakyThrows;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import java.security.Provider;
import java.util.Base64;

@Service
public class EncryptionServiceImpl implements EncryptionService {

    private final Aead aeadSystem;
    private final Provider provider;

    @SneakyThrows
    public EncryptionServiceImpl(Aead aeadSystem, Provider provider) {
        this.aeadSystem = aeadSystem;
        this.provider = provider;
    }

    @Override
    @SneakyThrows
    public byte[] encryptSecretKey(byte[] key) {
        byte[] encryptedPassword = aeadSystem.encrypt(key, null);
        return Base64.getEncoder().encode(encryptedPassword);
    }

    @Override
    @SneakyThrows
    public byte[] decryptSecretKey(byte[] encryptedKey) {
        byte[] decoded = Base64.getDecoder().decode(encryptedKey);
        return aeadSystem.decrypt(decoded, null);
    }

    @Override
    @SneakyThrows
    public byte[] encrypt(byte[] data, byte[] key) {
        AesGcmJce agjEncryption = new AesGcmJce(key);
        byte[] encrypted = agjEncryption.encrypt(data, null);
        return Base64.getEncoder().encode(encrypted);
    }

    @Override
    @SneakyThrows
    public byte[] decrypt(byte[] encrypted, byte[] key) {
        AesGcmJce agjDecryption = new AesGcmJce(key);
        byte[] decoded = Base64.getDecoder().decode(encrypted);
        return agjDecryption.decrypt(decoded, null);
    }

    @SneakyThrows
    public SecretKey generateKey(String password, String algo, byte[] salt, int iterCount) {
        PBEKeySpec pbeKeySpec = new PBEKeySpec(password.toCharArray(), salt, iterCount);
        SecretKeyFactory keyFac = SecretKeyFactory.getInstance(algo, provider);
        return keyFac.generateSecret(pbeKeySpec);
    }
}