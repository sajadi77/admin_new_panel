import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import FormikControl from "../../components/form/FormikControl";
import SubmitButton from "../../components/form/SubmitButton";
import PrevPageButton from "../../components/PrevPageButton";
import SpinnerLoad from "../../components/SpinnerLoad";
import { getAllBrandsService } from "../../services/brands";
import { getCategoriesService } from "../../services/category";
import { getAllColorsService } from "../../services/colors";
import { getAllGuaranteesService } from "../../services/guarantees";
import { initialValues, onSubmit, validationSchema } from "./core";

const AddProduct = () => {
  const location = useLocation()
  const productToEdit = location.state?.productToEdit
  const [reInitialValues, setReInitialValues]=useState(null)

  const [selectedCategories, setSelectedCategories]=useState([]); // used in editting
  const [selectedColors, setSelectedColors]=useState([]); // used in editting
  const [selectedGuarantees, setSelectedGuarantees]=useState([]); // used in editting

  const [parentCategories, setparentCategories] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [brands, setBrands] = useState([])
  const [colors, setColors] = useState([])
  const [guarantees, setGuarantees] = useState([])

  const getAllParentCategories = async ()=>{
    const res = await getCategoriesService();
    if (res.status === 200) {
      setparentCategories(res.data.data.map(d=>{
        return {id:d.id, value:d.title}
      }));
    }
  }
  const getAllBrands = async ()=>{
    const res = await getAllBrandsService();
    if (res.status === 200) {
      setBrands(res.data.data.map(d=>{
        return {id:d.id, value:d.original_name}
      }));
    }
  }
  const getAllColors = async ()=>{
    const res = await getAllColorsService();
    if (res.status === 200) {
      setColors(res.data.data.map(d=>{
        return {id:d.id, value:d.title}
      }));
    }
  }
  const getAllGuarantees = async ()=>{
    const res = await getAllGuaranteesService();
    if (res.status === 200) {
      setGuarantees(res.data.data.map(d=>{
        return {id:d.id, value:d.title}
      }));
    }
  }
  const setInitialSelectedValues = ()=>{
    if (productToEdit) {
      setSelectedCategories(productToEdit.categories.map(c=>{return {id:c.id, value:c.title}}))
      setSelectedColors(productToEdit.colors.map(c=>{return {id:c.id, value:c.title}}))
      setSelectedGuarantees(productToEdit.guarantees.map(c=>{return {id:c.id, value:c.title}}))
    }
  }
  useEffect(()=>{
    getAllParentCategories();
    getAllBrands();
    getAllColors();
    getAllGuarantees();
    setInitialSelectedValues()
    for (const key in productToEdit) {
      if (productToEdit[key] === null) productToEdit[key] = ""
    }
    if (productToEdit) 
      setReInitialValues({
        ...productToEdit,
        category_ids: productToEdit.categories.map(c=>c.id).join("-"),
        color_ids: productToEdit.colors.map(c=>c.id).join("-"),
        guarantee_ids: productToEdit.guarantees.map(g=>g.id).join("-"),
        image: ""
      });
    else setReInitialValues(null)
  },[])



  const handleSetMainCategories = async (value)=>{
    setMainCategories("waiting");
    if (value > 0) {
      const res = await getCategoriesService(value);
      if (res.status === 200) {
        setMainCategories(res.data.data.map(d=>{
          return {id:d.id, value:d.title}
        }));
      }
    }else{
      setMainCategories([]);
    }
  }

  return (
    <Formik
      initialValues={reInitialValues || initialValues}
      onSubmit={(values, actions) => onSubmit(values, actions, productToEdit)}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {
        formik=>{
          return (
            <Form>
              <div className="container mb-5">
              <h4 className="text-center my-3">{productToEdit ? (
                <>
                  ???????????? ?????????? :  
                  <span className="text-primary">{productToEdit.title}</span> 
                </>
              ) : "???????????? ?????????? ????????"}</h4>
                <div className="text-left col-md-6 col-lg-8 m-auto my-3">
                  <PrevPageButton />
                </div>
                <div className="row justify-content-center">
                  <FormikControl
                  label="???????? ???????? *"
                  className="col-md-6 col-lg-8"
                  control="select"
                  options={parentCategories}
                  name="parentCats"
                  firstItem="???????? ???????? ?????? ???? ???????????? ????????..."
                  handleOnchange={handleSetMainCategories}
                  />

                  {mainCategories === "waiting" ? (
                    <SpinnerLoad isSmall={true} colorClass="text-primary" />
                  ) : null}

                  <FormikControl
                  label="???????? ???????? *"
                  className="col-md-6 col-lg-8"
                  control="searchableSelect"
                  options={typeof(mainCategories) == "object" ? mainCategories : []}
                  name="category_ids"
                  firstItem="???????? ???????? ?????? ???? ???????????? ????????..."
                  resultType="string"
                  initialItems={selectedCategories}   
                  />
                  

                   <FormikControl
                    label="?????????? *"
                    className="col-md-6 col-lg-8"
                    control="input"
                    type="text"
                    name="title"
                    placeholder="?????? ???? ???????? ?? ?????????? ?????????????? ????????"
                  />

                  <FormikControl
                    label="???????? *"
                    className="col-md-6 col-lg-8"
                    control="input"
                    type="number"
                    name="price"
                    placeholder="?????? ???? ?????????? ?????????????? ????????(??????????)"
                  />

                  <FormikControl
                  label="?????? "
                  className="col-md-6 col-lg-8"
                  control="input"
                  type="number"
                  name="weight"
                  placeholder="?????? ???? ?????????? ?????????????? ????????(????????)"
                  />

                  <FormikControl
                  label="????????"
                  className="col-md-6 col-lg-8"
                  control="select"
                  options={brands}
                  name="brand_id"
                  firstItem="???????? ???????? ?????? ???? ???????????? ????????..."
                  /> 

                  <FormikControl
                  label="??????"
                  className="col-md-6 col-lg-8"
                  control="searchableSelect"
                  options={colors}
                  name="color_ids"
                  firstItem="?????? ???????? ?????? ???? ???????????? ????????..."
                  resultType="string"
                  initialItems={selectedColors}
                  />

                  <FormikControl
                  label="??????????????"
                  className="col-md-6 col-lg-8"
                  control="searchableSelect"
                  options={guarantees}
                  name="guarantee_ids"
                  firstItem="?????????????? ???????? ?????? ???? ???????????? ????????..."
                  resultType="string"
                  initialItems={selectedGuarantees}
                  />

                  {/* <FormikControl
                    label="??????????????"
                    className="col-md-6 col-lg-8"
                    control="textarea"
                    name="descriptions"
                    placeholder="?????? ???? ???????? ???????????? ?????????????? ??????"
                  /> */}

                  <FormikControl
                    label="??????????????"
                    className="col-md-6 col-lg-8"
                    control="ckeditor"
                    name="descriptions"
                    placeholder="?????? ???? ???????? ???????????? ?????????????? ??????"
                  />

                  <FormikControl
                    label="?????????????? ??????????"
                    className="col-md-6 col-lg-8"
                    control="textarea"
                    name="short_descriptions"
                    placeholder="?????? ???? ???????? ???????????? ?????????????? ??????"
                  />

                  <FormikControl
                    label="??????????????  ??????"
                    className="col-md-6 col-lg-8"
                    control="textarea"
                    name="cart_descriptions"
                    placeholder="?????? ???? ???????? ???????????? ?????????????? ??????"
                  />

                  {!productToEdit ? (
                    <FormikControl
                    label="??????????"
                    className="col-md-6 col-lg-8"
                    control="file"
                    name="image"
                    placeholder="??????????"
                    />
                  ) : null}

                  <FormikControl
                  label="?????????? ?????????? "
                  className="col-md-6 col-lg-8"
                  control="input"
                  type="text"
                  name="alt_image"
                  placeholder="?????? ???? ???????? ?? ?????????? ?????????????? ????????"
                  />

                  <FormikControl
                  label="?????????? ?????????? "
                  className="col-md-6 col-lg-8"
                  control="input"
                  type="text"
                  name="keywords"
                  placeholder="????????: ??????1-??????2-??????3"
                  />

                  <FormikControl
                    label="???????????? "
                    className="col-md-6 col-lg-8"
                    control="input"
                    type="number"
                    name="stock"
                    placeholder="?????? ???? ?????????? ?????????????? ????????(??????)"
                  />

                  <FormikControl
                    label="???????? ?????????? "
                    className="col-md-6 col-lg-8"
                    control="input"
                    type="number"
                    name="discount"
                    placeholder="?????? ???? ?????????? ?????????????? ????????(????????)"
                  />

                  <div className="btn_box text-center col-12 col-md-6 col-lg-8 mt-4">
                    <SubmitButton/>
                    <PrevPageButton className="me-2"/>
                  </div>
                </div>
              </div>
            </Form>
          )
        }
      }
    </Formik>
  );
};

export default AddProduct;
