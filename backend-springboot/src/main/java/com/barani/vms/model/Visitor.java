package com.barani.vms.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "visitors")
public class Visitor {

    @Id
    private String id;

    private String name;
    private String phone;
    private String email;
    private String address;
    private String company;
    private String purpose;
    private String vehicle;

    @Column(name = "num_visitors")
    private Integer numVisitors;

    @Column(name = "id_type")
    private String idType;

    @Column(name = "id_number")
    private String idNumber;

    @Column(name = "host_id")
    private String hostId;

    @Column(name = "host_name")
    private String hostName;

    @Column(name = "host_dept")
    private String hostDept;

    @Column(name = "visit_date")
    private String visitDate;

    @Column(name = "check_in")
    private String checkIn;

    @Column(name = "check_out")
    private String checkOut;

    @Column(name = "expected_exit")
    private String expectedExit;

    private String status;

    @Column(columnDefinition = "TEXT")
    private String photo;

    // Default constructor
    public Visitor() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public String getVehicle() { return vehicle; }
    public void setVehicle(String vehicle) { this.vehicle = vehicle; }

    public Integer getNumVisitors() { return numVisitors; }
    public void setNumVisitors(Integer numVisitors) { this.numVisitors = numVisitors; }

    public String getIdType() { return idType; }
    public void setIdType(String idType) { this.idType = idType; }

    public String getIdNumber() { return idNumber; }
    public void setIdNumber(String idNumber) { this.idNumber = idNumber; }

    public String getHostId() { return hostId; }
    public void setHostId(String hostId) { this.hostId = hostId; }

    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }

    public String getHostDept() { return hostDept; }
    public void setHostDept(String hostDept) { this.hostDept = hostDept; }

    public String getVisitDate() { return visitDate; }
    public void setVisitDate(String visitDate) { this.visitDate = visitDate; }

    public String getCheckIn() { return checkIn; }
    public void setCheckIn(String checkIn) { this.checkIn = checkIn; }

    public String getCheckOut() { return checkOut; }
    public void setCheckOut(String checkOut) { this.checkOut = checkOut; }

    public String getExpectedExit() { return expectedExit; }
    public void setExpectedExit(String expectedExit) { this.expectedExit = expectedExit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }

    @Column(name = "photo_id_doc", columnDefinition = "TEXT")
    private String photoIdDoc;

    @Column(name = "approve_token")
    private String approveToken;

    @Column(name = "reject_token")
    private String rejectToken;

    public String getPhotoIdDoc() { return photoIdDoc; }
    public void setPhotoIdDoc(String photoIdDoc) { this.photoIdDoc = photoIdDoc; }

    public String getApproveToken() { return approveToken; }
    public void setApproveToken(String approveToken) { this.approveToken = approveToken; }

    public String getRejectToken() { return rejectToken; }
    public void setRejectToken(String rejectToken) { this.rejectToken = rejectToken; }
}
