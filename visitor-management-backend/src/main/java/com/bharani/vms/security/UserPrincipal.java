package com.bharani.vms.security;

import com.bharani.vms.entity.SecurityUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Data
@AllArgsConstructor
public class UserPrincipal implements UserDetails {

    private UUID id;
    private String username;
    private String password;
    private String name;
    private String role;
    private Collection<? extends GrantedAuthority> authorities;

    public static UserPrincipal create(SecurityUser user, String passwordHash) {
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase().replace(" ", "_"));
        return new UserPrincipal(
                user.getId(),
                user.getUsername(),
                passwordHash,
                user.getName(),
                user.getRole(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
