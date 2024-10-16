import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import { Formik, FormikProps } from "formik";
import React, { useCallback, useRef, useState } from "react";
import {
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Button from "root/components/auth/Button";
import { TextField } from "root/components/auth/TextField";
import IconComponent from "root/components/customIcon";
import CustomWrapper from "root/components/customWrapper";
import GeneralModal from "root/components/modal";
import { showToast } from "root/components/toast";
import categories, { CategoryItemType } from "root/constants/categories";
import { Colors } from "root/constants/Colors";
import { height, width } from "root/constants/Dimensions";
import { CreateProductModel } from "root/constants/types/productTypes";
import { pickImage } from "root/utils/pickImage";
import { createProductSchema } from "root/utils/validations";

const initialValues: CreateProductModel = {
  images: [],
  name: "",
  price: 0,
  purchasingDate: "",
  category: "",
  description: "",
};

export default function AddProduct() {
  const categoriesBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const imageOptionsBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const formikRef = useRef<FormikProps<CreateProductModel> | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const { dismiss } = useBottomSheetModal();

  const handlePresentModalPress = useCallback(() => {
    categoriesBottomSheetModalRef.current?.present();
  }, []);
  const handlePresentOptionsModalPress = useCallback(() => {
    imageOptionsBottomSheetModalRef.current?.present();
  }, []);

  const options = [
    {
      title: "Remove",
      id: "remove",
      onPress: () => {
        console.log("presses");
        const newImages = images.filter((image) => image !== selectedImage);
        setImages(newImages);
      },
    },
  ];

  const renderDeleteOption = (item: any) => {
    return (
      <Pressable
        onPress={item.onPress}
        style={{
          borderColor: Colors.light.primary,
          borderWidth: 1,
          paddingVertical: 10,
          paddingLeft: 10,
          borderRadius: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <IconComponent name="trash-bin-outline" color={Colors.light.redColor} />
        <Text style={{ fontSize: 16, marginLeft: 10 }}>{item.title}</Text>
      </Pressable>
    );
  };

  const renderItem = useCallback((item: CategoryItemType, index: number) => {
    const IconComponent =
      item.icon.library === "Ionicons" ? Ionicons : MaterialIcons;
    return (
      <Pressable
        style={styles.itemStyle}
        onPress={() => {
          formikRef.current?.setFieldValue("category", item.name);
          dismiss();
        }}
      >
        <IconComponent
          name={item.icon.name as any}
          size={26}
          color={Colors.light.primary}
        />
        <Text style={{ marginLeft: 15, fontSize: 16, fontWeight: "500" }}>
          {item.name}
        </Text>
      </Pressable>
    );
  }, []);

  return (
    <>
      <CustomWrapper
        title="New Product"
        rightHeaderIcon
        rightHeaderIconTitle="cart"
      >
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={createProductSchema}
          onSubmit={async (values, { validateForm }) => {
            Keyboard.dismiss();
          }}
        >
          {({
            handleSubmit,
            errors,
            touched,
            setFieldValue,
            isValidating,
            isValid,
            handleChange,
            values,
          }) => {
            return (
              <>
                <View style={{ paddingHorizontal: width * 0.035 }}>
                  <View style={{ flexDirection: "row", marginBottom: 10 }}>
                    <Pressable
                      style={styles.addImageBox}
                      onPress={async () => {
                        const response = await pickImage();
                        if (!response) return;

                        const imageList = response?.map((image) => {
                          return image.uri;
                        });
                        if (images.length + imageList.length > 5) {
                          console.log("got here instead ");
                          return showToast({
                            text1: `Too many images selected`,
                            text2: `Image length exceeds 5`,
                            type: `info`,
                            position: "top",
                          });
                        }
                        setImages([...images, ...imageList]);
                      }}
                    >
                      <Text style={{ flexWrap: "wrap" }}>Add Images</Text>
                    </Pressable>
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={images}
                        horizontal
                        renderItem={({ item, index }) => {
                          return (
                            <Pressable
                              onLongPress={() => {
                                setSelectedImage(item);
                                handlePresentOptionsModalPress();
                              }}
                            >
                              <Image
                                source={{ uri: item }}
                                style={styles.image}
                              />
                            </Pressable>
                          );
                        }}
                      />
                    </View>
                  </View>
                  <TextField
                    label="Name"
                    leftIconTitle="bag-outline"
                    maxLength={12}
                    leftIcon
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    autoCapitalize="none"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    fieldName="name"
                    error={errors.name && isValid ? true : false}
                    errorMessage={errors.name}
                  />
                  <TextField
                    label="Price"
                    autoCapitalize="none"
                    maxLength={10}
                    keyboardType="numeric"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    leftIcon
                    leftIconTitle="cash-outline"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    error={
                      errors.price && isValidating && touched.price
                        ? true
                        : false
                    }
                    price
                    handleChange={handleChange}
                    errorMessage={errors.price}
                    fieldName="price"
                  />
                  <TextField
                    label="Purchasing Date"
                    editable={false}
                    autoCapitalize="none"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    isDateField
                    leftIcon
                    leftIconTitle="time-outline"
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    error={
                      errors.purchasingDate &&
                      isValidating &&
                      touched.purchasingDate
                        ? true
                        : false
                    }
                    errorMessage={errors.purchasingDate}
                    fieldName="purchasingDate"
                  />
                  <TextField
                    label="Category"
                    editable={false}
                    categoryValue={values.category}
                    autoCapitalize="none"
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    leftIcon
                    leftIconTitle="grid-outline"
                    rightIconName="caret-down"
                    rightIcon
                    rightIconPress={handlePresentModalPress}
                    secureTextEntry={false}
                    error={
                      errors.category && isValidating && touched.category
                        ? true
                        : false
                    }
                    errorMessage={errors.category}
                    setFieldValue={setFieldValue}
                    fieldName="category"
                  />
                  <TextField
                    label="Description"
                    numberOfLines={5}
                    maxLength={150}
                    multiline
                    viewProps={{
                      paddingVertical: 15,
                      marginBottom: 10,
                    }}
                    autoCapitalize="none"
                    error={
                      errors.description && isValidating && touched.description
                        ? true
                        : false
                    }
                    errorMessage={errors.description}
                    leftIconTitle="document-outline"
                    leftIcon
                    secureTextEntry={false}
                    setFieldValue={setFieldValue}
                    fieldName="description"
                    style={{
                      width: width * 0.7,
                    }}
                  />
                </View>
                <Button
                  buttonStyle={{
                    marginTop: height * 0.05,
                    alignSelf: "center",
                    paddingVertical: 10,
                  }}
                  disabled={!isValid}
                  onPress={handleSubmit}
                  label={"Create"}
                />
              </>
            );
          }}
        </Formik>
      </CustomWrapper>
      <GeneralModal
        ref={categoriesBottomSheetModalRef}
        title="Categories"
        itemsList={categories}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />
      <GeneralModal
        ref={imageOptionsBottomSheetModalRef}
        title="Options"
        initialSnap={0}
        itemsList={options}
        keyExtractor={(item) => item.id}
        renderItem={renderDeleteOption}
      />
    </>
  );
}

const styles = StyleSheet.create({
  itemStyle: {
    flexDirection: "row",
    height: height * 0.08,
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
    width: width * 0.9,
  },
  addImageBox: {
    width: width * 0.25,
    marginRight: 20,
    height: width * 0.25,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  image: {
    width: width * 0.25,
    height: width * 0.25,
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
});
