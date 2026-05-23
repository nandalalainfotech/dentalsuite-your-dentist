import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client/react";
import { X, CheckCircle2, AlertCircle, CalendarDays, CreditCard } from "lucide-react";
import { CREATE_PRACTICE_PERMISSIONS, GET_PERMISSION_MODULES_MASTER } from "../graphql/permissions.queries";
import { localClient } from "../../../api/apollo/localClient";
import toast from "react-hot-toast";
import authService from "../../../features/auth/auth.service";
import { CREATE_PRACTICE_SUBSCRIPTION, GET_PAYMENT_SETTINGS, UPDATE_PRACTICE_SUBSCRIPTION_DATES } from "../graphql/clients.query";
import { gql } from "@apollo/client";

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

type PaymentType =
    | "PAY_PER_PATIENT"
    | "PAY_PER_MONTH";

export default function AddPracticeForm({ onClose, onSuccess }: Props) {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const { data: modulesData } = useQuery(GET_PERMISSION_MODULES_MASTER, {
        client: localClient
    });
    const [updatePermissions] = useMutation(CREATE_PRACTICE_PERMISSIONS, {
        client: localClient
    });

    const [updatePracticeDates] =
        useMutation(
            UPDATE_PRACTICE_SUBSCRIPTION_DATES,
            {
                client: localClient
            }
        );

    const [formData, setFormData] = useState({
        practice_name: "",
        abn_number: "",
        practice_type: "",
        practice_phone: "",
        address: "",
        city: "",
        state: "",
        postcode: "",
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        type: "PRACTICE_ADMIN",
        logo: "",
        termsAccepted: false
    });

    const waitForPracticeInfo = async (
        practiceId: string,
        retries = 10
    ) => {

        for (let i = 0; i < retries; i++) {

            const res = await localClient.query({

                query: gql`
                query GetPractice($id: uuid!) {
                    practice_info_by_pk(id: $id) {
                        id
                    }
                }
            `,

                variables: {
                    id: practiceId
                },

                fetchPolicy: "network-only"
            });

            const data = res.data as any;

            if (data?.practice_info_by_pk) {
                return true;
            }

            await new Promise(resolve =>
                setTimeout(resolve, 500)
            );
        }

        return false;
    };

    const [selectedPaymentType, setSelectedPaymentType] =
        useState<PaymentType>("PAY_PER_PATIENT");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checkbox = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: checkbox.checked
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const validateForm = () => {
        if (
            !formData.practice_name ||
            !formData.abn_number ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.mobile ||
            !formData.address ||
            !formData.city ||
            !formData.state ||
            !formData.postcode ||
            !formData.practice_phone ||
            !formData.practice_type
        ) {
            toast.error("Please fill in all fields");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return false;
        }
        if (!formData.termsAccepted) {
            toast.error("You must accept the terms and conditions");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }
        const abnRegex = /^\d{6,11}$/;
        if (!abnRegex.test(formData.abn_number)) {
            toast.error("Please enter a valid ABN number");
            return false;
        }
        return true;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!validateForm()) return;
        const signupPayload = {
            practiceName: formData.practice_name,
            abnNumber: formData.abn_number,
            practiceType: formData.practice_type,
            practicePhone: formData.practice_phone,
            practiceAddress: formData.address,
            practiceCity: formData.city,
            practiceState: formData.state,
            practicePostcode: formData.postcode,
            firstName: formData.first_name,
            lastName: formData.last_name,
            email: formData.email,
            mobileNumber: formData.mobile,
            password: formData.password,
            practiceLogo: formData.logo,
            type: formData.type || "PRACTICE_ADMIN"
        };
        try {
            setIsLoading(true);
            const result = await authService.signup(signupPayload);

            if (result.success) {

                const practiceId = result.user?.id;

                const startDate = new Date();

                const endDate = new Date();

                endDate.setDate(
                    endDate.getDate() + 30
                );

                endDate.setHours(
                    23,
                    59,
                    59,
                    999
                );

                if (practiceId) {

                    /* =========================
                        CREATE PRACTICE INFO
                    ========================= */

                    await updatePracticeDates({

                        variables: {

                            id: practiceId,

                            subscription_started_at:
                                startDate.toISOString(),

                            subscription_expiry_at:
                                endDate.toISOString()

                        }

                    });

                    const practiceReady =
                        await waitForPracticeInfo(practiceId);

                    if (!practiceReady) {

                        throw new Error(
                            "Practice info creation timeout"
                        );

                    }

                    /* =========================
                        CREATE SUBSCRIPTION
                    ========================= */

                    await localClient.mutate({

                        mutation: CREATE_PRACTICE_SUBSCRIPTION,

                        variables: {

                            object: {

                                practice_id: practiceId,

                                current_payment_type:
                                    selectedPaymentType,

                                current_price:
                                    latestPrice,

                                pending_payment_type: null,

                                pending_price: null,

                                subscription_start_date:
                                    startDate.toISOString(),

                                subscription_end_date:
                                    endDate.toISOString(),

                                pending_start_date: null,

                                is_active: true
                            }

                        }

                    });

                    /* =========================
                        CREATE PERMISSIONS
                    ========================= */

                    try {

                        const modules =
                            (modulesData as any)
                                ?.practice_permission_modules_master ?? [];

                        if (modules.length > 0) {

                            const allPermissions =
                                modules.map((module: any) => ({

                                    module:
                                        module.module_key,

                                    path:
                                        module.path,

                                    actions: [
                                        ...module.actions
                                    ]

                                }));

                            await updatePermissions({

                                variables: {

                                    practiceId,

                                    permissions:
                                        allPermissions,

                                    defaultPermission:
                                        allPermissions
                                }

                            });

                        }

                    } catch (permError) {

                        console.error(
                            "Permission setup error:",
                            permError
                        );

                    }

                }

                toast.success(
                    "New practice account is created"
                );

                setTimeout(() => {

                    onSuccess();

                    navigate("/superadmin/clients");

                }, 1500);

            } else {

                setError(
                    result.message as string
                );

            }

        } catch (err: any) {
            setError(err?.message || "Something went wrong while creating the practice");
        } finally {
            setIsLoading(false);
        }
    };

    const {
        data: paymentSettingsData
    } = useQuery(
        GET_PAYMENT_SETTINGS,
        {
            client: localClient
        }
    );

    const paymentSettingsDataAny =
        paymentSettingsData as any;

    const paymentSettings =
        paymentSettingsDataAny?.payment_settings?.[0];

    const latestPrice = useMemo(() => {

        return selectedPaymentType === "PAY_PER_MONTH"
            ? paymentSettings?.pay_per_month_amount || 0
            : paymentSettings?.pay_per_patient_amount || 0;

    }, [
        selectedPaymentType,
        paymentSettings
    ]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1a2b3c]/60 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20">
                <div className="px-10 py-4 border-b flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h2 className="text-2xl font-black text-[#1a2b3c] ">
                            Register New Practice
                        </h2>
                        <p className="text-gray-500 font-medium mt-1">
                            Fill in the details to create a practice account
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-all text-gray-400"
                    >
                        <X size={24} strokeWidth={2.5} />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto px-10 py-8 custom-scrollbar">
                    {error && (
                        <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-xl flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold text-sm">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-8 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-xl flex items-center gap-3">
                            <CheckCircle2 size={20} />
                            <span className="font-bold text-sm">{success}</span>
                        </div>
                    )}
                    <form id="practice-form" onSubmit={handleSubmit} className="space-y-10">
                        {/* Practice Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Practice Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Name *</label>
                                    <input type="text" name="practice_name" value={formData.practice_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ABN Number *</label>
                                    <input type="text" name="abn_number" value={formData.abn_number} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Type *</label>
                                    <input name="practice_type" value={formData.practice_type} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Practice Phone *</label>
                                    <input type="tel" name="practice_phone" value={formData.practice_phone} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City/Suburb *</label>
                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                                    <input name="state" value={formData.state} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Postcode *</label>
                                    <input type="text" name="postcode" value={formData.postcode} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>
                        {/* Contact Information */}
                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Primary Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                                    <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                                    <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile *</label>
                                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                                    <input type="password" name="password" value={formData.password} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg" />
                                </div>
                            </div>
                        </div>

                        {/* Subscription Information */}

                        <div>
                            <h3 className="text-lg font-bold text-[#1a2b3c] mb-6">
                                Subscription Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* ================= PAY PER PATIENT ================= */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedPaymentType(
                                            "PAY_PER_PATIENT"
                                        )
                                    }
                                    className={`border rounded-2xl p-5 text-left transition-all ${selectedPaymentType === "PAY_PER_PATIENT"
                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                                        : "border-gray-200 bg-white hover:border-orange-300"
                                        }`}
                                >

                                    <div className="flex items-center justify-between mb-4">

                                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                                            <CreditCard className="w-6 h-6 text-orange-500" />
                                        </div>

                                        {selectedPaymentType === "PAY_PER_PATIENT" && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                SELECTED
                                            </span>
                                        )}

                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        Pay Per Patient
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Billing based on patients
                                    </p>

                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Current Price
                                            </span>

                                            <span className="text-lg font-semibold text-[#1a2b3c]">
                                                ${paymentSettings?.pay_per_patient_amount || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Start Date
                                            </span>

                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                End Date
                                            </span>

                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {(() => {
                                                    const end = new Date();
                                                    end.setDate(end.getDate() + 30);
                                                    return end.toLocaleDateString();
                                                })()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Remaining Days
                                            </span>

                                            <span className="text-sm font-semibold text-green-600">
                                                30 Days
                                            </span>
                                        </div>

                                    </div>

                                </button>

                                {/* ================= PAY PER MONTH ================= */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedPaymentType(
                                            "PAY_PER_MONTH"
                                        )
                                    }
                                    className={`border rounded-2xl p-5 text-left transition-all ${selectedPaymentType === "PAY_PER_MONTH"
                                        ? "border-orange-500 bg-orange-50 ring-2 ring-orange-100"
                                        : "border-gray-200 bg-white hover:border-orange-300"
                                        }`}
                                >

                                    <div className="flex items-center justify-between mb-4">

                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                                            <CalendarDays className="w-6 h-6 text-blue-500" />
                                        </div>

                                        {selectedPaymentType === "PAY_PER_MONTH" && (
                                            <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
                                                SELECTED
                                            </span>
                                        )}

                                    </div>

                                    <h3 className="text-lg font-semibold">
                                        Pay Per Month
                                    </h3>

                                    <p className="text-sm text-gray-500">
                                        Monthly subscription
                                    </p>

                                    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 space-y-3">

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Current Price
                                            </span>

                                            <span className="text-lg font-semibold text-[#1a2b3c]">
                                                ${paymentSettings?.pay_per_month_amount || 0}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Start Date
                                            </span>

                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {new Date().toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                End Date
                                            </span>

                                            <span className="text-sm font-semibold text-[#1a2b3c]">
                                                {(() => {
                                                    const end = new Date();
                                                    end.setDate(end.getDate() + 30);
                                                    return end.toLocaleDateString();
                                                })()}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Remaining Days
                                            </span>

                                            <span className="text-sm font-semibold text-green-600">
                                                30 Days
                                            </span>
                                        </div>

                                    </div>

                                </button>

                            </div>

                        </div>

                        {/* Terms */}
                        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="mt-1.5 h-4 w-4"
                                />
                                <span className="text-gray-600 text-sm leading-relaxed">
                                    I agree to the{" "}
                                    <a href="#" className="text-orange-600 hover:underline font-medium">
                                        Terms & Conditions
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-orange-600 hover:underline font-medium">
                                        Privacy Policy
                                    </a>
                                    . I confirm that I have the authority to register this practice and that all
                                    provided information is accurate.
                                </span>
                            </label>
                        </div>
                    </form>
                </div>
                <div className="px-10 py-4 border-t bg-gray-50 flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-3 font-bold text-gray-500 hover:text-gray-600 bg-gray-200 rounded-2xl"
                    >
                        Cancel
                    </button>
                    <button
                        form="practice-form"
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#f47521] hover:bg-[#d9651d] text-white px-10 py-3 rounded-2xl font-black flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                Creating Account...
                            </>
                        ) : (
                            "Create Practice Account"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}