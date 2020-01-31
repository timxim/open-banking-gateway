package de.adorsys.opba.db.domain.entity.sessions;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Getter
@Setter
@Entity
@DiscriminatorValue(SessionTypes.Values.AUTHENTICATION)
public class AuthenticationSession extends AbstractSession {
}