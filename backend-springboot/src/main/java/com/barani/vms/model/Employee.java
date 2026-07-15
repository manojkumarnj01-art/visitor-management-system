package com.barani.vms.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    private String id;

    private String name;
    private String dept;
    private String designation;
    private String email;
    private String phone;
    private String cabin;
    private String status;

    @Column(name = "campus_status")
    private String campusStatus;

    @Column(columnDefinition = "TEXT")
    private String photo;

    // Default constructor
    public Employee() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDept() { return dept; }
    public void setDept(String dept) { this.dept = dept; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getCabin() { return cabin; }
    public void setCabin(String cabin) { this.cabin = cabin; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCampusStatus() { return campusStatus; }
    public void setCampusStatus(String campusStatus) { this.campusStatus = campusStatus; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}
