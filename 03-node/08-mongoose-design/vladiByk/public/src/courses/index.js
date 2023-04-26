"use strict";
const teacherId = sessionStorage.getItem("techerId");
if (teacherId)
    renderCoursePage(teacherId);
